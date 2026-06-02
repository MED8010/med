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
  const messageTimeoutRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);

  // Ref for latest state to avoid scanner re-initialization on state change
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (type, targetEmploye = null) => {
    const activeEmploye = targetEmploye || stateRef.current.employe;
    if (!activeEmploye || stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: activeEmploye._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionTaken = res.data.pointage?.effectiveAction || res.data.pointage?.scanner_action || type;
      const actionLabel = actionTaken === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${activeEmploye.prenom} ${activeEmploye.nom}`
      });

      // Start cooldown
      setCooldown(true);

      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldown(false);
        if (stateRef.current.isAutoMode) {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }
      }, 3000);

      // Auto clear message
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      // If auto mode, handle pointage immediately
      if (stateRef.current.isAutoMode) {
        handlePointage('auto', res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  }, [handlePointage]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const onScanError = useCallback((err) => {
    // console.warn(err);
  }, []);

  // Use refs for stable callbacks passed to scanner
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanErrorRef = useRef(onScanError);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    onScanErrorRef.current = onScanError;
  }, [onScanSuccess, onScanError]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
      aspectRatio: 1.0
    });

    scanner.render(
      (res) => onScanSuccessRef.current(res),
      (err) => onScanErrorRef.current(err)
    );
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
    };
  }, []);

  const handleToggleAutoMode = () => {
    const newMode = !isAutoMode;
    setIsAutoMode(newMode);
    localStorage.setItem('scanner_auto_mode', newMode.toString());
    // Reset state when toggling
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div className="scanner-controls">
          <div className="toggle-container">
            <span className={`toggle-label ${isAutoMode ? 'active' : ''}`}>Mode Automatique</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAutoMode}
                onChange={handleToggleAutoMode}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card scanner-section">
          <h3>📷 Scanner Live</h3>
          <div className="scanner-viewport">
            <div id="reader" style={{ width: '100%' }}></div>
            {cooldown && (
              <div className="cooldown-overlay">
                <div className="cooldown-content">
                  <div className="check-icon">✓</div>
                  <p>Pointage Réussi</p>
                  <small>Patientez 3s...</small>
                </div>
              </div>
            )}
          </div>

          {!isAutoMode && scanResult && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}
        </div>

        <div className="section-card info-section">
          <h3>👤 Informations Employé</h3>
          {loading && !cooldown && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'} animate-fade-in`}>
              {message.type === 'success' ? '✅' : '❌'} {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--primary-glow)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800, border: '2px solid var(--primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="employee-details-mini">
                <div className="detail-item">
                  <label>Service</label>
                  <span>{employe.service?.nom_service || 'Non assigné'}</span>
                </div>
                <div className="detail-item">
                  <label>UAP</label>
                  <span>{employe.uap?.nom_uap || 'Non assignée'}</span>
                </div>
                <div className="detail-item">
                  <label>Poste</label>
                  <span>{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 30 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div className="auto-mode-indicator">
                  <span className="pulse-dot"></span>
                  Traitement automatique actif
                </div>
              )}
            </div>
          ) : (
            <div className="empty-scanner-state">
              <div className="qr-placeholder">📱</div>
              <p>{scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}</p>
              {isAutoMode && <small>Le pointage sera détecté automatiquement</small>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
