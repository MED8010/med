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
    return localStorage.getItem('scanner_auto_mode') === 'true';
  });
  const [cooldown, setCooldown] = useState(false);
  const scannerRef = useRef(null);

  // Use refs to store current state for the stable callback
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp) return;

    setLoading(true);
    setCooldown(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const effectiveAction = res.data.pointage.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Reset after success
      setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        setCooldown(false);
      }, 5000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      setCooldown(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      // If auto mode is on, perform pointage immediately
      if (stateRef.current.isAutoMode) {
        handlePointage('auto', foundEmploye);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
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

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
      aspectRatio: 1.0,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [onScanSuccess, onScanError]);

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());
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
        <div className="header-actions">
          <div className="toggle-container" onClick={toggleAutoMode}>
            <span className="toggle-label">Mode Auto</span>
            <div className={`toggle-switch ${isAutoMode ? 'on' : 'off'}`}>
              <div className="toggle-handle"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card scanner-section">
          <div className="card-header">
            <h3>📷 Scanner</h3>
            {cooldown && <span className="badge badge-warning">Refroidissement...</span>}
          </div>

          <div className="reader-container">
            <div id="reader" style={{ width: '100%' }}></div>
            {cooldown && (
              <div className="cooldown-overlay">
                <div className="cooldown-timer"></div>
                <p>Scan réussi ! Prêt dans quelques secondes...</p>
              </div>
            )}
          </div>

          {(scanResult || employe) && !isAutoMode && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Prêt pour scan suivant
              </button>
            </div>
          )}
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message-box animate-fadeIn ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
              <span className="message-icon">{message.type === 'error' ? '❌' : '✅'}</span>
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div className="employe-profile-summary">
                <div className="profile-avatar-large">
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div className="profile-info-main">
                  <h2>{employe.prenom} {employe.nom}</h2>
                  <p className="matricule-tag">{employe.matricule}</p>
                  <div className="service-badge-pill">{employe.service?.nom_service}</div>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Poste</label>
                  <span>{employe.poste || 'Collaborateur'}</span>
                </div>
                <div className="info-item">
                  <label>Statut</label>
                  <span className="badge badge-success">Actif</span>
                </div>
              </div>

              {!isAutoMode && !cooldown && (
                <div className="action-grid-buttons">
                  <button
                    className="btn-primary btn-entry"
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary btn-exit"
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div className="auto-mode-feedback">
                  <div className="pulse-indicator"></div>
                  <p>Traitement automatique activé</p>
                </div>
              )}
            </div>
          ) : (
            <div className="scanner-placeholder">
              <div className="qr-icon-placeholder">QR</div>
              <p>{scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}</p>
              {!scanResult && <div className="scan-line"></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
