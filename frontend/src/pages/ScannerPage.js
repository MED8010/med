import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const scannerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Refs to access latest state in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const pointage = response.data.pointage;

      // Determine effective action for message
      let actionLabel = type;
      if (type === 'auto') {
        // The backend returns the pointage. If it was just created/updated,
        // we can guess if it was entry or exit if the backend returns it.
        // For now let's just use a generic success or improve backend response.
        actionLabel = pointage.heure_sortie ? 'sortie' : 'entrée';
      }

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel === 'entree' || actionLabel === 'entrée' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        setEmploye(emp);

        // Auto reset after 3 seconds
        cooldownTimerRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setCooldown(false);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        // Manual mode: reset message after 3 seconds but keep employee info
        messageTimerRef.current = setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 3000);
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
      const empData = res.data;
      setEmploye(empData);

      if (stateRef.current.isAutoMode) {
        await handlePointage('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setMessage({ type: '', text: '' });
        }, 2000);
      }
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

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  }, [onScanSuccess, onScanError]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        scannerRef.current = null;
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [startScanner]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
    setMessage({ type: '', text: '' });
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
  };

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
    handleReset();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="actions-group">
            <div className="mode-toggle" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Mode Automatique</span>
                <label className="switch">
                    <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {isAutoMode && <span className="badge badge-primary animate-pulse">Auto actif</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: 'none' }}></div>

          {cooldown && (
            <div className="cooldown-overlay" style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 5, borderRadius: 'var(--radius-lg)', color: 'white', backdropFilter: 'blur(4px)'
            }}>
                <div className="spinner" style={{ marginBottom: 15 }}></div>
                <p style={{ fontWeight: 600 }}>Traitement terminé</p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>Prêt pour le prochain scan dans quelques secondes...</p>
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
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
              {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '20px',
                  background: 'var(--grad-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, boxShadow: 'var(--shadow-primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 25 }}>
                <div className="detail-card" style={{ background: 'var(--bg-hover)', padding: '12px', borderRadius: '12px' }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Service</label>
                    <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
                </div>
                <div className="detail-card" style={{ background: 'var(--bg-hover)', padding: '12px', borderRadius: '12px' }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Poste</label>
                    <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-success)', border: 'none', height: 48, justifyContent: 'center' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                    >
                    📥 Pointer Entrée
                    </button>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-warning)', border: 'none', height: 48, justifyContent: 'center' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                    >
                    📤 Pointer Sortie
                    </button>
                </div>
              )}

              {isAutoMode && (
                  <div style={{ textAlign: 'center', padding: '10px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '10px', fontWeight: 600, fontSize: 13 }}>
                      ✨ Pointage automatique traité
                  </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
              <div style={{ fontSize: 48, opacity: 0.2 }}>🪪</div>
              <p>{scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
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
          background-color: var(--border);
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
          transform: translateX(20px);
        }
        .slider.round {
          border-radius: 24px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        .animate-pulse {
            animation: pulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ScannerPage;
