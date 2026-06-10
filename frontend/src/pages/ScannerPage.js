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

  // Refs to store current state for the stable callback
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  // Forward declarations for stable callbacks
  const onScanSuccessRef = useRef();
  const loadEmployeRef = useRef();
  const handlePointageRef = useRef();

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((result) => onScanSuccessRef.current(result), (err) => {
      // onScanError
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

  const startCooldown = useCallback((ms) => {
    setCooldown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setCooldown(false);
      setScanResult(null);
      setEmploye(null);
      setMessage({ type: '', text: '' });
    }, ms);
  }, []);

  const handlePointage = useCallback(async (emp, type) => {
    const targetEmploye = emp || stateRef.current.employe;
    if (!targetEmploye) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: targetEmploye._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionLabel = res.data.pointage.effectiveAction === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${targetEmploye.prenom} ${targetEmploye.nom}`
      });

      if (stateRef.current.isAutoMode) {
        startCooldown(5000);
      } else {
        messageTimerRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) {
        startCooldown(3000);
      }
    } finally {
      setLoading(false);
    }
  }, [startScanner, startCooldown]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      if (stateRef.current.isAutoMode) {
        handlePointageRef.current(res.data, 'auto');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (stateRef.current.isAutoMode) {
        startCooldown(3000);
      } else {
        startScanner();
      }
    } finally {
      setLoading(false);
    }
  }, [startScanner, startCooldown]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setScanResult(result);

    if (!stateRef.current.isAutoMode) {
      stopScanner();
    }

    loadEmployeRef.current(result);
  }, [stopScanner]);

  // Sync refs
  onScanSuccessRef.current = onScanSuccess;
  loadEmployeRef.current = loadEmploye;
  handlePointageRef.current = handlePointage;

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [startScanner, stopScanner]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    stopScanner().then(() => {
      startScanner();
    });
  };

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());
    handleReset();
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
            <span className="toggle-label">Mode Mains-Libres (Auto)</span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card scanner-section">
          <div className="section-header">
            <h3>📷 Scanner</h3>
            {isAutoMode && <span className="badge badge-success animate-pulse">AUTO ACTIVE</span>}
          </div>

          <div className="reader-container" style={{ position: 'relative' }}>
            <div id="reader" style={{ width: '100%' }}></div>
            {cooldown && (
              <div className="cooldown-overlay">
                <div className="spinner"></div>
                <p>Prêt dans quelques secondes...</p>
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
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message-box animate-slide-in ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
              <span className="message-icon">{message.type === 'error' ? '❌' : '✅'}</span>
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in employee-details">
              <div className="employee-profile-header" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div className="avatar-large" style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--primary-glow)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{employe.prenom} {employe.nom}</h2>
                  <p className="matricule" style={{ margin: 0, color: 'var(--text-muted)' }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item" style={{ marginBottom: 15 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Service</label>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{employe.service?.nom_service}</span>
                </div>
                <div className="detail-item" style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Poste</label>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && (
                <div className="pointage-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handlePointage(null, 'entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage(null, 'sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && !message.text && (
                <div className="auto-processing" style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
                  <div className="spinner" style={{ width: 20, height: 20, display: 'inline-block', marginRight: 10 }}></div>
                  <span>Traitement automatique en cours...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="scanner-placeholder" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div className="placeholder-icon" style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔲</div>
              <p>{scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
