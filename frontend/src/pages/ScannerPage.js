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

  const scannerRef = useRef(null);
  const cooldownRef = useRef(false);
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const messageTimerRef = useRef(null);

  // Keep refs in sync with state for callbacks
  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
  }, [isAutoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

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

    scanner.render(onScanSuccessRef.current, (err) => {});
    scannerRef.current = scanner;
  }, []);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye; // Always use targetEmploye to avoid dependency on state
    if (!emp || loadingRef.current) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionTaken = res.data.pointage.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionTaken === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Clear message and reset after delay
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        if (!isAutoModeRef.current) {
            startScanner();
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, [startScanner]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      if (isAutoModeRef.current) {
        handlePointage('auto', foundEmploye);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!isAutoModeRef.current) {
          startScanner();
      }
    } finally {
      setLoading(false);
    }
  }, [handlePointage, startScanner]);

  const onScanSuccess = useCallback((result) => {
    if (cooldownRef.current) return;

    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 5000);

    if (!isAutoModeRef.current && scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  // Use refs for callbacks passed to scanner to prevent re-renders restarting scanner
  const onScanSuccessRef = useRef(onScanSuccess);
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [startScanner]);

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());

    // Reset scanner if changing mode
    handleReset();
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    startScanner();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="header-actions">
          <div className="stats-box" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 15 }}>
             <span style={{ fontSize: 14, fontWeight: 600 }}>Mode Auto</span>
             <label className="switch">
                <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
                <span className="slider round"></span>
             </label>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {isAutoMode && <span className="badge badge-success">Mode Automatique Actif</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: 'none' }}></div>

          {!isAutoMode && scanResult && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}

          {isAutoMode && (
            <div style={{ marginTop: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                Le scanner reste actif. Présentez un nouveau badge après chaque pointage.
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

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <label style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <label style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', justifyContent: 'center' }}
                    onClick={() => handlePointage('entree', employe)}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', justifyContent: 'center' }}
                    onClick={() => handlePointage('sortie', employe)}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div style={{
                    padding: 20, background: 'var(--bg-hover)', borderRadius: 12,
                    textAlign: 'center', border: '1px solid var(--border)'
                }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary)' }}>
                        Pointage automatique en cours...
                    </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.3 }}>🪪</div>
              {scanResult ? 'Recherche en cours...' : 'Veuillez présenter un badge QR code devant la caméra'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
