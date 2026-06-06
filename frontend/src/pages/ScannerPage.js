import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(() => {
    return localStorage.getItem('scanner_auto_mode') === 'true';
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const scannerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Refs to store state for stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp || stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionLabel = res.data.pointage?.effectiveAction || (type === 'auto' ? 'auto' : type);

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (isAutoMode) {
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
        }, 3000);
      }

      // Clear message after 5 seconds
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 5000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, [isAutoMode]);

  const loadEmploye = useCallback(async (matricule) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (stateRef.current.isAutoMode) {
        // In auto mode, trigger pointage immediately
        await handlePointage('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  }, [handlePointage]);

  // Sync refs for callbacks
  const onScanSuccessRef = useRef(null);
  const loadEmployeRef = useRef(null);
  const handlePointageRef = useRef(null);

  useEffect(() => {
    onScanSuccessRef.current = (result) => {
      if (stateRef.current.loading || stateRef.current.cooldown) return;

      // If we already have the same result and not in auto mode, ignore
      if (!stateRef.current.isAutoMode && scanResult === result) return;

      setScanResult(result);
      loadEmployeRef.current(result);
    };
    loadEmployeRef.current = loadEmploye;
    handlePointageRef.current = handlePointage;
  });

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((res) => onScanSuccessRef.current(res), (err) => {
        // error handling
    });
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());

    // Reset state when toggling
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
  };

  const handleManualReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
      </div>

      <div className="scanner-controls">
        <div
          className={`toggle-container ${isAutoMode ? 'active' : ''}`}
          onClick={toggleAutoMode}
        >
          <div className="toggle-switch">
            <div className="toggle-handle"></div>
          </div>
          <span className="toggle-label">Mode Automatique (Mains-libres)</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {isAutoMode && (
              <span className="badge badge-success">Auto-détection Active</span>
            )}
          </div>

          <div className={`scanner-wrapper ${cooldown ? 'cooldown' : ''}`}>
            <div id="reader" style={{ width: '100%' }}></div>

            {cooldown && (
              <div className="cooldown-overlay">
                <div className="cooldown-spinner"></div>
                <div className="cooldown-text">
                  Pointage Réussi !<br />
                  <span style={{ fontSize: '12px', opacity: 0.8 }}>Réinitialisation dans 3s...</span>
                </div>
              </div>
            )}
          </div>

          {!isAutoMode && scanResult && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleManualReset}>
                🔄 Scanner un autre badge
              </button>
            </div>
          )}
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
              {message.type === 'success' ? '✅ ' : '❌ '}
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--primary-glow)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Service</label>
                <span style={{ fontWeight: 700 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Poste</label>
                <span style={{ fontWeight: 700 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div className="info-message" style={{ margin: 0 }}>
                  ℹ️ Mode Automatique : Le pointage est déterminé par le système.
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🪪</div>
              {scanResult ? 'Recherche de l\'employé...' : 'Veuillez présenter votre badge devant la caméra'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
