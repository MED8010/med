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
  const timerRef = useRef(null);
  const cooldownRef = useRef(null);

  // Use refs for values needed in callbacks to avoid stale closures
  // and scanner re-initialization
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
      aspectRatio: 1.0
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handlePointage = async (type, targetEmploye = null) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const effectiveAction = res.data.pointage?.heure_sortie ? 'sortie' : 'entrée';

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (stateRef.current.isAutoMode) {
        // In auto mode, show success then reset for next scan
        setCooldown(true);
        cooldownRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        // Manual mode: reset after 3s but keep display for now
        timerRef.current = setTimeout(() => {
          handleReset();
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) {
          setCooldown(true);
          setTimeout(() => { setCooldown(false); setMessage({type: '', text: ''}); }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadEmploye = async (matricule) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      if (stateRef.current.isAutoMode) {
        await handlePointage('auto', foundEmploye);
      } else {
        await stopScanner();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé' });
      setScanResult(null);
      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        setTimeout(() => { setCooldown(false); setMessage({type: '', text: ''}); }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sync callbacks with refs to avoid scanner restarts
  const onScanSuccessRef = useRef();
  onScanSuccessRef.current = (result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;
    if (result === scanResult && !stateRef.current.isAutoMode) return;

    setScanResult(result);
    loadEmploye(result);
  };

  const onScanSuccess = (result) => onScanSuccessRef.current(result);
  const onScanError = (err) => {};

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [startScanner, stopScanner]);

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    startScanner();
  };

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Mode Automatique</span>
            <label className="toggle-switch">
                <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
                <span className="toggle-slider"></span>
            </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ margin: 0 }}>📷 Caméra</h3>
            {isAutoMode && <span className="badge badge-success">AUTO ACTIVE</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: 'none' }}></div>

          {cooldown && (
              <div className="scanner-cooldown-overlay">
                  <div className="cooldown-timer-ring"></div>
                  <strong style={{ color: 'var(--primary)' }}>Scan validé !</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Patientez 3s...</span>
              </div>
          )}

          {!isAutoMode && scanResult && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}

          <div style={{ marginTop: 15, padding: 12, background: 'var(--bg-hover)', borderRadius: 8, fontSize: '12px', color: 'var(--text-secondary)' }}>
              <strong>Conseil :</strong> Placez le QR code au centre du cadre. En mode auto, la détection est instantanée.
          </div>
        </div>

        <div className="section-card">
          <h3>👤 Résultat du Scan</h3>

          {loading && !cooldown && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                  <div className="spinner"></div>
              </div>
          )}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'} animate-slide-in`}>
              {message.type === 'error' ? '❌ ' : '✅ '} {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: '15px', background: 'var(--primary-glow)', borderRadius: '16px' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '18px',
                  background: 'var(--grad-primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800, boxShadow: 'var(--shadow-primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 25 }}>
                  <div className="stats-box" style={{ padding: '12px' }}>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Service</label>
                      <div style={{ fontWeight: 600 }}>{employe.service?.nom_service || 'N/A'}</div>
                  </div>
                  <div className="stats-box" style={{ padding: '12px' }}>
                      <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Poste</label>
                      <div style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</div>
                  </div>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-success)', border: 'none' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                    >
                    📥 Pointer Entrée
                    </button>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-warning)', border: 'none' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                    >
                    📤 Pointer Sortie
                    </button>
                </div>
              )}

              {isAutoMode && !loading && (
                  <div style={{ textAlign: 'center', padding: '10px', color: 'var(--success)', fontWeight: 600 }}>
                      ✓ Traitement automatique effectué
                  </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              {!scanResult ? (
                  <>
                    <div style={{ fontSize: '40px', marginBottom: 15, opacity: 0.5 }}>🪪</div>
                    <p>En attente d'un scan...</p>
                  </>
              ) : (
                  <p>Chargement des données...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
