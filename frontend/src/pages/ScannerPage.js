import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [cooldown, setCooldown] = useState(false);

  const scannerRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Use refs to access latest state in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const onScanSuccessRef = useRef();
  const loadEmployeRef = useRef();
  const handlePointageRef = useRef();

  const handlePointage = useCallback(async (type) => {
    const currentEmploye = stateRef.current.employe;
    if (!currentEmploye) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: currentEmploye._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionLabel = res.data.effectiveAction === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${currentEmploye.prenom} ${currentEmploye.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        resetTimeoutRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) {
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      // If auto mode, trigger pointage immediately
      if (stateRef.current.isAutoMode) {
        // Need to wait for state update or use res.data directly
        const empData = res.data;
        // Temporarily override ref for immediate use
        stateRef.current.employe = empData;
        await handlePointageRef.current('auto');
      } else {
        startScanner();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode) {
        startScanner();
      } else {
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (!stateRef.current.isAutoMode && scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmployeRef.current(result);
  }, []);

  const onScanError = useCallback((err) => {
    // console.warn(err);
  }, []);

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccessRef.current, onScanError);
    scannerRef.current = scanner;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    loadEmployeRef.current = loadEmploye;
    handlePointageRef.current = handlePointage;
  }, [onScanSuccess, loadEmploye, handlePointage]);

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

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    startScanner();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="mode-toggle" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Mode Manuel</span>
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
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Mode Auto</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
              <div className="cooldown-overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: 'var(--radius-lg)',
                  color: 'white',
                  backdropFilter: 'blur(4px)'
              }}>
                  <div className="spinner" style={{ marginBottom: '15px' }}></div>
                  <p style={{ fontWeight: 700 }}>Traitement terminé</p>
                  <p style={{ fontSize: '12px', opacity: 0.8 }}>Prêt dans 3 secondes...</p>
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

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Service</label>
                <span>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Poste</label>
                <span>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handlePointageRef.current('entree')}
                    disabled={loading}
                    >
                    📥 Pointer Entrée
                    </button>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointageRef.current('sortie')}
                    disabled={loading}
                    >
                    📤 Pointer Sortie
                    </button>
                </div>
              )}

              {isAutoMode && !cooldown && (
                  <div className="info-message">
                      <span>⚡ Traitement automatique en cours...</span>
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

    </div>
  );
};

export default ScannerPage;
