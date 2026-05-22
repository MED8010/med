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
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Keep state and functions in refs for stable callbacks without scanner restarts
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  const loadEmployeRef = useRef(null);
  const startScannerRef = useRef(null);
  const onScanSuccessRef = useRef(null);
  const handlePointageRef = useRef(null);

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

      // In auto mode, trigger pointage immediately
      if (stateRef.current.isAutoMode) {
        handlePointageRef.current('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode) {
        startScannerRef.current();
      }
    } finally {
      setLoading(false);
    }
  }, []);
  loadEmployeRef.current = loadEmploye;

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setScanResult(result);

    // In manual mode, we stop scanner to show employee info
    if (!stateRef.current.isAutoMode) {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        }
    }

    loadEmployeRef.current(result);
  }, []);
  onScanSuccessRef.current = onScanSuccess;

  const onScanError = useCallback((err) => {
    // console.warn(err);
  }, []);

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
      rememberLastUsedCamera: true
    });

    scanner.render((res) => onScanSuccessRef.current(res), onScanError);
    scannerRef.current = scanner;
  }, [onScanError]);
  startScannerRef.current = startScanner;

  useEffect(() => {
    startScannerRef.current();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [startScanner]);

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

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        // Reset after success in manual mode
        messageTimerRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScannerRef.current();
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, []);
  handlePointageRef.current = handlePointage;

  const handleReset = useCallback(() => {
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
    setMessage({ type: '', text: '' });
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    startScannerRef.current();
  }, []);

  const toggleAutoMode = () => {
    const nextMode = !isAutoMode;
    setIsAutoMode(nextMode);
    handleReset();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="d-flex align-center gap-12">
            <span style={{ fontWeight: 600, fontSize: '14px', color: isAutoMode ? 'var(--success)' : 'var(--text-muted)' }}>
                {isAutoMode ? '⚡ MODE AUTO' : 'Manuel'}
            </span>
            <label className="switch">
                <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
                <span className="slider round"></span>
            </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

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
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'} animate-slide-in`}>
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
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
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
