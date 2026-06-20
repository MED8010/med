import React, { useState, useEffect, useRef } from 'react';
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
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Sync state with refs for stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  useEffect(() => {
    localStorage.setItem('scanner_auto_mode', isAutoMode);
  }, [isAutoMode]);

  const startScanner = React.useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => { });
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((result) => onScanSuccessRef.current(result), onScanError);
    scannerRef.current = scanner;
  }, []);

  useEffect(() => {
    startScanner();
    const currentScannerRef = scannerRef.current;
    return () => {
      if (currentScannerRef) {
        currentScannerRef.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [startScanner]);

  const onScanSuccess = (result) => {
    const { loading, cooldown } = stateRef.current;
    if (loading || cooldown) return;

    setScanResult(result);
    loadEmployeRef.current(result);
  };

  const onScanSuccessRef = useRef(onScanSuccess);
  onScanSuccessRef.current = onScanSuccess;

  const onScanError = (err) => {
    // console.warn(err);
  };

  const loadEmploye = async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      // In auto mode, trigger pointage immediately
      if (stateRef.current.isAutoMode) {
        handlePointageRef.current('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      startCooldown();
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeRef = useRef(loadEmploye);
  loadEmployeRef.current = loadEmploye;

  const startCooldown = () => {
    setCooldown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setCooldown(false);
      setScanResult(null);
      setEmploye(null);
    }, 5000);
  };

  const handlePointage = async (type, targetEmploye = null) => {
    const activeEmploye = targetEmploye || stateRef.current.employe;
    if (!activeEmploye) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: activeEmploye._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const effectiveAction = res.data.pointage.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${activeEmploye.prenom} ${activeEmploye.nom}`
      });

      startCooldown();

      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      startCooldown();
    } finally {
      setLoading(false);
    }
  };

  const handlePointageRef = useRef(handlePointage);
  handlePointageRef.current = handlePointage;

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    startScanner();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="header-actions">
          <div className="toggle-container" title="Mode Automatique">
            <span className={`toggle-label ${isAutoMode ? 'active' : ''}`}>Auto Mode</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAutoMode}
                onChange={(e) => setIsAutoMode(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card scanner-section">
          <div className="card-header">
            <h3>📷 Scanner</h3>
            {cooldown && <span className="badge badge-warning">Cooldown actif...</span>}
          </div>
          <div className="reader-wrapper">
            <div id="reader" style={{ width: '100%' }}></div>
            {cooldown && (
              <div className="cooldown-overlay">
                <div className="cooldown-content">
                  <div className="spinner-small"></div>
                  <span>Prêt dans quelques secondes...</span>
                </div>
              </div>
            )}
          </div>
          {(scanResult || cooldown) && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset} disabled={loading}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}
        </div>

        <div className="section-card info-section">
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
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

              <div className="detail-item" style={{ marginBottom: 15 }}>
                <label>Service</label>
                <span>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24 }}>
                <label>Poste</label>
                <span>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
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
                  <div className="pulse-dot"></div>
                  <span>Mode Automatique Actif</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              {scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
