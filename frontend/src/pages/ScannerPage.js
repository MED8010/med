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

  // Refs to store current state values for the scanner callbacks
  // This prevents the scanner from having to be re-initialized when state changes
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      // If auto-mode is ON, proceed to automatic pointage
      if (stateRef.current.isAutoMode) {
        handlePointage(empData, 'auto');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // isAutoMode is accessed via ref

  const onScanSuccess = useCallback((result) => {
    // Prevent multiple scans if already loading or in cooldown
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    // Clear previous reset timeout
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    if (!stateRef.current.isAutoMode && scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const onScanError = (err) => {
    // console.warn(err);
  };

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  }, [onScanSuccess]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [startScanner]);

  const handlePointage = async (targetEmploye, type) => {
    const emp = targetEmploye || employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const actionLabel = response.data.effectiveAction === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Activate cooldown
      setCooldown(true);
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldown(false);
      }, 3000);

      // Auto-reset UI after 3s
      resetTimeoutRef.current = setTimeout(() => {
        if (!stateRef.current.isAutoMode) {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        } else {
          // In auto mode, just clear the message and current employee view to be ready for next scan
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      setCooldown(false);
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

  const toggleAutoMode = () => {
    const nextMode = !isAutoMode;
    setIsAutoMode(nextMode);
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });

    // Always ensure scanner is running when toggling
    setTimeout(() => startScanner(), 100);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Mode Automatique (Mains Libres)</span>
          <label className="switch">
            <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3>📷 Scanner</h3>
            {isAutoMode && <span className="badge badge-success">MODE AUTO ACTIF</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: 'none' }}></div>

          {cooldown && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 10, borderRadius: 16, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexDirection: 'column', color: 'white',
              backdropFilter: 'blur(4px)'
            }}>
              <div className="spinner" style={{ borderTopColor: 'white' }}></div>
              <p style={{ marginTop: 15, fontWeight: 700 }}>Traitement... Patientez 3s</p>
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
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
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

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Service</label>
                <span style={{ fontWeight: 700 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Poste</label>
                <span style={{ fontWeight: 700 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', justifyContent: 'center' }}
                    onClick={() => handlePointage(null, 'entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', justifyContent: 'center' }}
                    onClick={() => handlePointage(null, 'sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div style={{
                  padding: 15, background: 'var(--primary-glow)',
                  borderRadius: 12, textAlign: 'center', border: '1px solid var(--primary)'
                }}>
                  <p style={{ color: 'var(--primary)', fontWeight: 700, margin: 0 }}>
                    ✨ Pointage automatique en cours...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.3 }}>🪪</div>
              {scanResult ? 'Recherche de l\'employé...' : 'Veuillez scanner un badge QR code pour commencer'}
              {isAutoMode && <p style={{ fontSize: 12, marginTop: 10 }}>Le mode automatique enregistrera l'entrée ou la sortie sans intervention.</p>}
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
        input:focus + .slider {
          box-shadow: 0 0 1px var(--primary);
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default ScannerPage;
