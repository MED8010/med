import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const scannerRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Refs to access latest state in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

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

  const handlePointage = useCallback(async (type, targetEmploye) => {
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
      const actionType = res.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionType === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Start cooldown if in auto mode or after manual success
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

      // Auto-reset message
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
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

      if (stateRef.current.isAutoMode) {
        // Automatically trigger pointage in auto mode
        await handlePointage('auto', foundEmploye);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      // In auto mode, we don't stop the scanner, just wait for next scan
      if (!stateRef.current.isAutoMode) {
        setEmploye(null);
      }
    } finally {
      setLoading(false);
    }
  }, [handlePointage]);

  const onScanSuccess = useCallback((result) => {
    // Prevent double processing
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (!stateRef.current.isAutoMode) {
        stopScanner();
    }

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye, stopScanner]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
      aspectRatio: 1.0
    });

    scanner.render(onScanSuccess, (err) => {
      // Ignore scan errors
    });
    scannerRef.current = scanner;
  }, [onScanSuccess]);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [startScanner, stopScanner]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    stopScanner().then(() => {
        startScanner();
    });
  };

  const toggleAutoMode = () => {
    const nextMode = !isAutoMode;
    setIsAutoMode(nextMode);
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: 'info', text: nextMode ? 'Mode Automatique Activé' : 'Mode Manuel Activé' });

    // Ensure scanner is running
    if (!scannerRef.current) {
        startScanner();
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div className="action-buttons">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Mode Automatique</span>
            <label className="switch">
              <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3>📷 Scanner</h3>
            {isAutoMode && <span className="badge badge-primary">Auto-Scan Actif</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: 'none' }}></div>

          {cooldown && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 10, backdropFilter: 'blur(4px)', color: 'white', textAlign: 'center'
            }}>
              <div className="spinner" style={{ borderTopColor: 'white', marginBottom: 15 }}></div>
              <h3 style={{ color: 'white', margin: 0 }}>Traitement...</h3>
              <p>Veuillez patienter 3s</p>
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
            <div className={`message ${message.type === 'error' ? 'error-message' : message.type === 'info' ? 'info-message' : 'success-message'}`} style={{ animation: 'fadeIn 0.3s ease' }}>
              {message.type === 'success' ? '✅ ' : message.type === 'error' ? '❌ ' : 'ℹ️ '}
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '24px',
                  background: 'var(--grad-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, boxShadow: 'var(--shadow-primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{employe.matricule}</p>
                  <span className="badge badge-success" style={{ marginTop: 8 }}>Compte Actif</span>
                </div>
              </div>

              <div className="stats-box" style={{ padding: 15, marginBottom: 24, background: 'var(--bg-hover)', border: 'none' }}>
                <div className="detail-item" style={{ marginBottom: 10, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  <label style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Service</label>
                  <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
                </div>
                <div className="detail-item">
                  <label style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Poste</label>
                  <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-success)', border: 'none', height: 50 }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-warning)', border: 'none', height: 50 }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && cooldown && (
                <div style={{ textAlign: 'center', padding: '20px', background: 'var(--success-bg)', borderRadius: '12px', border: '1px solid var(--success)' }}>
                   <p style={{ color: 'var(--success)', fontWeight: 700, margin: 0 }}>Pointage Validé avec Succès !</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{
                textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20
            }}>
              <div style={{ fontSize: 48, opacity: 0.2 }}>🪪</div>
              <p style={{ maxWidth: 200 }}>
                {scanResult ? 'Recherche de l\'employé...' : 'Positionnez votre badge QR code devant la caméra'}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 22px;
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
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: var(--primary);
        }
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
        #reader__dashboard_section_csr button {
            background: var(--primary) !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 8px !important;
            cursor: pointer !important;
        }
        #reader__status_span {
            display: none !important;
        }
      `}</style>
    </div>
  );
};

export default ScannerPage;
