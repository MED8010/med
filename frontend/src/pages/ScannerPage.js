import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(() => {
    const saved = localStorage.getItem('scanner_auto_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [cooldown, setCooldown] = useState(false);

  const scannerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Use refs to provide stable callbacks to the scanner
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointageRef = useRef(null);

  const loadEmploye = useCallback(async (matricule) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      // If Auto Mode is on, perform pointage immediately
      if (stateRef.current.isAutoMode) {
        if (handlePointageRef.current) {
          handlePointageRef.current('auto', res.data);
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.cooldown || stateRef.current.loading) return;

    // Check if it's the same matricule being scanned too quickly
    if (result === scanResult && stateRef.current.cooldown) return;

    setScanResult(result);
    loadEmploye(result);
  }, [scanResult, loadEmploye]);

  const onScanError = useCallback((err) => {
    // console.warn(err);
  }, []);

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [onScanSuccess, onScanError]);

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

      const response = await apiClient.post('/pointages', payload);
      const actionTaken = response.data.pointage.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionTaken === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Activate cooldown to prevent double scans
      setCooldown(true);
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
      }, 5000);

      // Reset employee info after successful pointage if in auto mode
      if (type === 'auto' || isAutoMode) {
        messageTimerRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 4000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, [isAutoMode]);

  useEffect(() => {
    handlePointageRef.current = handlePointage;
  }, [handlePointage]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
  };

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', JSON.stringify(newVal));
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="scanner-controls">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={toggleAutoMode}
            />
            <span className="slider round"></span>
            <span className="toggle-label">Mode Auto: {isAutoMode ? 'ON' : 'OFF'}</span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-content">
                <div className="spinner"></div>
                <p>Patientez quelques secondes...</p>
              </div>
            </div>
          )}

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button className="btn-secondary" onClick={handleReset}>
              🔄 Réinitialiser
            </button>
          </div>
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
              <span style={{ fontSize: '20px', marginRight: '10px' }}>
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '20px',
                  background: 'var(--grad-primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800,
                  boxShadow: 'var(--shadow-primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '24px' }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: '4px 0', color: 'var(--primary)', fontWeight: '700' }}>{employe.matricule}</p>
                  <span className="badge badge-primary">{employe.service?.nom_service}</span>
                </div>
              </div>

              <div className="detail-item" style={{
                marginBottom: 15,
                padding: '12px',
                background: 'var(--bg-hover)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <label style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Poste</label>
                <span style={{ fontWeight: '700' }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 30 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-success)', border: 'none', height: '50px' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-warning)', border: 'none', height: '50px' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && !message.text && (
                <div style={{ textAlign: 'center', padding: '20px', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)', fontWeight: '600' }}>
                  Traitement automatique en cours...
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
              border: '2px dashed var(--border)',
              borderRadius: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🪪</div>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>
                {scanResult ? 'Recherche de l\'employé...' : 'Veuillez scanner un badge pour commencer'}
              </p>
              <p style={{ fontSize: '13px', marginTop: '8px', opacity: 0.7 }}>
                Le système détectera automatiquement s'il s'agit d'une entrée ou d'une sortie.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
