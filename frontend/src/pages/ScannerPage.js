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

  // Refs for state values used in callbacks to avoid stale closures
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handleReset = useCallback(() => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        startScanner();
      }).catch(() => {
        startScanner();
      });
    } else {
      startScanner();
    }
  }, []);

  const handlePointage = useCallback(async (type) => {
    const currentEmploye = stateRef.current.employe;
    if (!currentEmploye) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: currentEmploye._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const action = response.data.pointage.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${currentEmploye.prenom} ${currentEmploye.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 3000);
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
      if (!stateRef.current.isAutoMode) {
          setTimeout(startScanner, 3000);
      }
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

      if (stateRef.current.isAutoMode) {
          // Auto-confirm pointage in auto mode
          await handlePointageRef.current('auto');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode) {
        startScanner();
      } else {
          // In auto mode, just wait for next scan
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (!stateRef.current.isAutoMode && scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmployeRef.current(result);
  }, []);

  // Refs for callbacks to use in scanner
  const onScanSuccessRef = useRef(onScanSuccess);
  const loadEmployeRef = useRef(loadEmploye);
  const handlePointageRef = useRef(handlePointage);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    loadEmployeRef.current = loadEmploye;
    handlePointageRef.current = handlePointage;
  }, [onScanSuccess, loadEmploye, handlePointage]);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render((res) => onScanSuccessRef.current(res), (err) => { /* ignore error */ });
    scannerRef.current = scanner;
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const toggleAutoMode = () => {
    const next = !isAutoMode;
    setIsAutoMode(next);
    localStorage.setItem('scanner_auto_mode', next.toString());
    handleReset();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="flex align-center gap-12">
            <span style={{ fontWeight: 600, fontSize: 13 }}>Mode Automatique</span>
            <label className="switch">
                <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
                <span className="slider round"></span>
            </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}></div>

          {cooldown && (
              <div className="cooldown-overlay">
                  <div className="cooldown-content">
                      <div className="spinner"></div>
                      <p>Traitement terminé. Prêt dans quelques secondes...</p>
                  </div>
              </div>
          )}

          {!isAutoMode && scanResult && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>
          {loading && !cooldown && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'} animate-slide-in`}>
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

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', justifyContent: 'center' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                    >
                    📥 Pointer Entrée
                    </button>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', justifyContent: 'center' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                    >
                    📤 Pointer Sortie
                    </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              {scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
              {isAutoMode && <p style={{ fontSize: 12, marginTop: 10 }}>Mode Mains-Libres Activé</p>}
            </div>
          )}
        </div>
      </div>

      <style>{`
          .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
          }
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
          }
          input:checked + .slider {
            background-color: var(--primary);
          }
          input:checked + .slider:before {
            transform: translateX(26px);
          }
          .slider.round {
            border-radius: 24px;
          }
          .slider.round:before {
            border-radius: 50%;
          }
          .cooldown-overlay {
              position: absolute;
              inset: 0;
              background: rgba(255,255,255,0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10;
              backdrop-filter: blur(2px);
              border-radius: 12px;
          }
          body.dark-mode .cooldown-overlay {
              background: rgba(15,14,26,0.8);
          }
          .cooldown-content {
              text-align: center;
              color: var(--primary);
          }
          .cooldown-content p {
              margin-top: 10px;
              font-weight: 600;
              font-size: 13px;
          }
      `}</style>
    </div>
  );
};

export default ScannerPage;
