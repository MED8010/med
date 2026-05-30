import React, { useState, useEffect, useRef } from 'react';
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

  // Refs for callbacks to prevent stale closures without re-rendering scanner
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

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

  const startScanner = () => {
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
  };

  const onScanSuccess = (result) => {
    const { loading, cooldown } = stateRef.current;
    if (loading || cooldown) return;

    setScanResult(result);
    loadEmploye(result);
  };

  const onScanError = (err) => {
    // Silent errors
  };

  const loadEmploye = async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const emp = res.data;
      setEmploye(emp);

      // If Auto Mode, perform pointage immediately
      if (stateRef.current.isAutoMode) {
        handlePointage('auto', emp);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé' });
      setScanResult(null);

      messageTimerRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePointage = async (type, targetEmploye) => {
    const activeEmploye = targetEmploye || employe;
    if (!activeEmploye || stateRef.current.cooldown) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: activeEmploye._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const action = res.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} validé pour ${activeEmploye.prenom} ${activeEmploye.nom}`
      });

      // Activate cooldown
      setCooldown(true);
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
        if (stateRef.current.isAutoMode) {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur d\'enregistrement' });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
  };

  const toggleAutoMode = () => {
    const next = !isAutoMode;
    setIsAutoMode(next);
    localStorage.setItem('scanner_auto_mode', next.toString());
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: isAutoMode ? 'var(--success)' : 'var(--text-muted)' }}>
            {isAutoMode ? '⚡ Mode Automatique Actif' : 'Manual Mode'}
          </span>
          <label className="switch">
            <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {cooldown && <span className="badge badge-warning animate-pulse">Cooldown actif...</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: 'none' }}></div>

          {cooldown && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10, backdropFilter: 'blur(2px)'
            }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div className="spinner" style={{ margin: '0 auto 10px', borderTopColor: 'white' }}></div>
                <p style={{ fontWeight: 700 }}>Traitement... Patientez</p>
              </div>
            </div>
          )}

          {scanResult && !isAutoMode && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Nouveau Scan
              </button>
            </div>
          )}
        </div>

        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>👤 Statut Pointage</h3>
            {loading && <div className="spinner" style={{ width: 20, height: 20 }}></div>}
          </div>

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
              {message.type === 'success' ? '✅' : '⚠️'} {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: 15, background: 'var(--bg-hover)', borderRadius: 12 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'var(--grad-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, boxShadow: 'var(--shadow-primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{employe.matricule} • {employe.service?.nom_service}</p>
                </div>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div style={{ textAlign: 'center', padding: '10px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: 8, fontWeight: 600 }}>
                  ⚡ Enregistrement automatique effectué
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 15 }}>🪪</div>
              <p>{scanResult ? 'Identification...' : 'Présentez votre badge QR code devant la caméra'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
