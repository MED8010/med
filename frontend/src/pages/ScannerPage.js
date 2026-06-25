import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Refs for callbacks to avoid re-renders of scanner
  const stateRef = useRef({ isAutoMode, cooldown, loading, employe });

  useEffect(() => {
    stateRef.current = { isAutoMode, cooldown, loading, employe };
  }, [isAutoMode, cooldown, loading, employe]);

  const onScanError = (err) => {
    // console.warn(err);
  };

  const startScanner = useCallback(() => {
    // If scanner already exists, clear it first
    const init = () => {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 250, height: 250 },
        fps: 10,
        rememberLastUsedCamera: true
      });
      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
    };

    if (scannerRef.current) {
      scannerRef.current.clear().then(init).catch(init);
    } else {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointage = async (targetEmploye, type) => {
    const emp = targetEmploye || employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const { effectiveAction } = res.data.pointage || res.data;

      const actionLabel = effectiveAction === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        if (!stateRef.current.isAutoMode) {
          startScanner();
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) {
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

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
  }, [startScanner]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.cooldown || stateRef.current.loading) return;

    if (!stateRef.current.isAutoMode) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    } else {
      // In auto mode, we use cooldown
      setCooldown(true);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
      }, 5000);
    }

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

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

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    startScanner();
  };

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());
    if (newVal) {
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
        <div className="actions-group" style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', padding: '8px 15px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Mode Auto</span>
            <label className="switch">
              <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%', overflow: 'hidden', borderRadius: 12 }}></div>

          {cooldown && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10, borderRadius: 16, color: 'white', fontWeight: 'bold'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ marginBottom: 10, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></div>
                Cooldown 5s...
              </div>
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
