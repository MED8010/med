import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const scannerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Use refs for stable callbacks to avoid scanner restarts while still accessing latest state
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScanSuccess = (result) => {
    // Check current state via ref to avoid stale closures
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (!stateRef.current.isAutoMode) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    }

    setScanResult(result);
    loadEmploye(result);
  };

  const onScanError = (err) => {
    // Silent
  };

  const loadEmploye = async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      if (stateRef.current.isAutoMode) {
        handlePointage('auto', res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode) {
        startScanner();
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePointage = async (type, targetEmploye = null) => {
    const emp = targetEmploye || employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const actionLabel = response.data.effectiveAction === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (isAutoMode) {
        setCooldown(true);
        if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);

        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
        }, 3000);

        messageTimerRef.current = setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      } else {
        setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (isAutoMode) {
        setCooldown(true);
        setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    startScanner();
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
  }, [startScanner]);

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div className="mode-toggle-card">
          <div className="toggle-container">
            <span className={`mode-label ${!isAutoMode ? 'active' : ''}`}>Manuel</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAutoMode}
                onChange={(e) => {
                    setIsAutoMode(e.target.checked);
                    handleReset();
                }}
              />
              <span className="slider round"></span>
            </label>
            <span className={`mode-label ${isAutoMode ? 'active' : ''}`}>Automatique</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner {isAutoMode && <span className="badge badge-success" style={{ marginLeft: 10 }}>Mode Auto</span>}</h3>
          <div id="reader" style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-content">
                <div className="spinner"></div>
                <p>Traitement terminé. Prêt dans 3s...</p>
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
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'} animate-fadeIn`}>
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
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div className="auto-info-box">
                  <p>Traitement automatique en cours...</p>
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

      <style jsx>{`
        .mode-toggle-card {
          background: var(--bg-card);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .toggle-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .mode-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          transition: color 0.3s;
        }
        .mode-label.active {
          color: var(--primary);
        }
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
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
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
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          border-radius: 12px;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s;
        }
        .cooldown-content {
          text-align: center;
          color: white;
        }
        .cooldown-content p {
          margin-top: 15px;
          font-weight: 600;
        }
        .auto-info-box {
          background: var(--primary-glow);
          color: var(--primary);
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          border: 1px dashed var(--primary);
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid var(--border);
        }
        .detail-item label {
            color: var(--text-muted);
            font-size: 13px;
        }
        .detail-item span {
            font-weight: 600;
            color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

export default ScannerPage;
