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
  const [message, setMessage] = useState({ type: '', text: '', effectiveAction: '' });

  const scannerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Refs for state to be used in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
      aspectRatio: 1.0
    });

    // Use a ref for onScanSuccess to ensure the scanner always calls the latest version
    // without having to restart the scanner when dependencies change.
    scanner.render((result) => onScanSuccessRef.current(result), (err) => {
      // Ignore scan errors
    });

    scannerRef.current = scanner;
  }, []);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error("Failed to clear scanner", err);
      }
    }
  }, []);

  const triggerCooldown = useCallback(() => {
    setCooldown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setCooldown(false);
    }, 5000);
  }, []);

  const handlePointage = useCallback(async (type, targetEmploye = null) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const effectiveAction = res.data.pointage?.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage ${effectiveAction === 'entree' ? 'd\'entrée' : 'de sortie'} enregistré avec succès`,
        effectiveAction
      });

      // Show success for 3 seconds then reset for next scan
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '', effectiveAction: '' });
        triggerCooldown();
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage', effectiveAction: '' });
      setLoading(false);
    } finally {
      if (!targetEmploye) setLoading(false);
    }
  }, [triggerCooldown]);

  const handlePointageRef = useRef(handlePointage);
  useEffect(() => { handlePointageRef.current = handlePointage; }, [handlePointage]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '', effectiveAction: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      // If Auto Mode, trigger pointage immediately
      if (stateRef.current.isAutoMode) {
        handlePointageRef.current('auto', res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur', effectiveAction: '' });
      setScanResult(null);
      triggerCooldown();
    } finally {
      setLoading(false);
    }
  }, [triggerCooldown]);

  const loadEmployeRef = useRef(loadEmploye);
  useEffect(() => { loadEmployeRef.current = loadEmploye; }, [loadEmploye]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown || stateRef.current.employe) return;

    setScanResult(result);
    loadEmployeRef.current(result);
  }, []);

  const onScanSuccessRef = useRef(onScanSuccess);
  useEffect(() => { onScanSuccessRef.current = onScanSuccess; }, [onScanSuccess]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '', effectiveAction: '' });
    setCooldown(false);
  };

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [startScanner, stopScanner]);

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div className="action-buttons">
          <div className="auto-mode-toggle" onClick={toggleAutoMode} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-card)',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Mode Auto
            </span>
            <div style={{
              width: '40px',
              height: '20px',
              background: isAutoMode ? 'var(--success)' : 'var(--text-muted)',
              borderRadius: '20px',
              position: 'relative',
              transition: 'background 0.3s'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: isAutoMode ? '22px' : '2px',
                transition: 'left 0.3s'
              }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}></div>

          {cooldown && (
            <div className="cooldown-overlay" style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-lg)',
              color: 'white',
              textAlign: 'center'
            }}>
              <div className="spinner" style={{ borderTopColor: 'white', marginBottom: '15px' }}></div>
              <p style={{ fontWeight: 600 }}>Prêt dans quelques secondes...</p>
            </div>
          )}

          {scanResult && !employe && !loading && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Annuler / Relancer
              </button>
            </div>
          )}
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div className="spinner"></div>
            </div>
          )}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px',
              textAlign: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>
                {message.type === 'error' ? '❌' : (message.effectiveAction === 'entree' ? '👋' : '🏠')}
              </span>
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>{message.text}</p>
                {message.type === 'success' && employe && (
                  <p style={{ margin: '4px 0 0', opacity: 0.8 }}>{employe.prenom} {employe.nom}</p>
                )}
              </div>
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: '15px', background: 'var(--bg-hover)', borderRadius: '12px' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--primary-glow)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800, border: '2px solid var(--primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Service</label>
                  <span>{employe.service?.nom_service}</span>
                </div>
                <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Poste</label>
                  <span>{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-success)', border: 'none', height: '50px' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-warning)', border: 'none', height: '50px' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && !message.text && (
                <div style={{ textAlign: 'center', padding: '20px', background: 'var(--primary-glow)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
                  <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 600 }}>Traitement automatique en cours...</p>
                </div>
              )}
            </div>
          ) : (
            !loading && !message.text && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>🪪</div>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>
                  {scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
                </p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>
                  {isAutoMode ? 'Mode automatique activé' : 'Mode manuel activé'}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
