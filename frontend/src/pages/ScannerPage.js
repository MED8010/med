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

  // Use refs to avoid stale closures in scanner callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  // Defined early so they can be referenced
  const startScannerRef = useRef(null);
  const handlePointageRef = useRef(null);
  const loadEmployeRef = useRef(null);

  const startScanner = useCallback(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    // eslint-disable-next-line no-use-before-define
    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  startScannerRef.current = startScanner;

  const handlePointage = useCallback(async (type, targetEmploye = null) => {
    const activeEmploye = targetEmploye || stateRef.current.employe;
    if (!activeEmploye) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: activeEmploye._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionDone = res.data.pointage?.effectiveAction || (type === 'auto' ? 'pointage' : type);

      setMessage({
        type: 'success',
        text: `Pointage d'${actionDone === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${activeEmploye.prenom} ${activeEmploye.nom}`
      });

      // Activate cooldown
      setCooldown(true);
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
      }, 5000);

      // Reset UI after delay
      messageTimerRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        if (!stateRef.current.isAutoMode && startScannerRef.current) {
            startScannerRef.current();
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, []);

  handlePointageRef.current = handlePointage;

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      if (stateRef.current.isAutoMode && handlePointageRef.current) {
        handlePointageRef.current('auto', res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode && startScannerRef.current) {
        startScannerRef.current();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  loadEmployeRef.current = loadEmploye;

  function onScanSuccess(result) {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (scannerRef.current && !stateRef.current.isAutoMode) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    if (loadEmployeRef.current) {
        loadEmployeRef.current(result);
    }
  }

  function onScanError(err) {
    // console.warn(err);
  }

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());
    setMessage({ type: 'info', text: `Mode Auto ${newVal ? 'Activé' : 'Désactivé'}` });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const handleReset = () => {
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
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="header-actions">
          <div className="toggle-container" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Mode Auto</span>
            <button
              onClick={toggleAutoMode}
              style={{
                width: 44, height: 22, borderRadius: 11, background: isAutoMode ? 'var(--success)' : 'var(--text-muted)',
                border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 2, left: isAutoMode ? 24 : 2, transition: 'all 0.3s'
              }} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}></div>

          {cooldown && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10, borderRadius: 'var(--radius-lg)', color: 'white',
              flexDirection: 'column', gap: 10, backdropFilter: 'blur(4px)'
            }}>
              <div className="spinner" style={{ borderTopColor: 'white' }}></div>
              <span style={{ fontWeight: 600 }}>Cooldown actif (5s)...</span>
            </div>
          )}

          {scanResult && !isAutoMode && (
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
