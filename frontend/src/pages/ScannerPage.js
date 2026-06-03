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

  // Refs for state and callbacks to avoid circular dependencies and stale closures
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  const onScanSuccessRef = useRef();
  const loadEmployeRef = useRef();
  const handlePointageRef = useRef();

  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(
      (result) => onScanSuccessRef.current?.(result),
      (error) => { /* console.warn(error); */ }
    );
    scannerRef.current = scanner;
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

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const currentEmploye = targetEmploye || stateRef.current.employe;
    if (!currentEmploye) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: currentEmploye._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const effectiveAction = res.data.pointage.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${currentEmploye.prenom} ${currentEmploye.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setScanResult(null);
          setEmploye(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      } else {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) {
        setTimeout(startScanner, 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [startScanner]);

  handlePointageRef.current = handlePointage;

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      if (stateRef.current.isAutoMode) {
        handlePointageRef.current('auto', foundEmploye);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      setTimeout(startScanner, 2000);
    } finally {
      setLoading(false);
    }
  }, [startScanner]);

  loadEmployeRef.current = loadEmploye;

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    stopScanner();
    setScanResult(result);
    loadEmployeRef.current(result);
  }, [stopScanner]);

  onScanSuccessRef.current = onScanSuccess;

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

  const toggleAutoMode = () => {
    const nextMode = !isAutoMode;
    setIsAutoMode(nextMode);
    localStorage.setItem('scanner_auto_mode', nextMode.toString());
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
    setMessage({ type: '', text: '' });
    stopScanner().then(startScanner);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', padding: '8px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Mode Automatique</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={toggleAutoMode}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div className="scanner-cooldown-overlay">
              <div className="cooldown-timer"></div>
              <span>Traitement terminé</span>
              <small style={{ opacity: 0.8, marginTop: 4 }}>Prochain scan dans 3s...</small>
            </div>
          )}

          {scanResult && !cooldown && (
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

              {isAutoMode && (
                <div className="info-message" style={{ margin: 0 }}>
                  <span style={{ fontSize: 18 }}>⚡</span>
                  <div>
                    <strong>Mode Auto Activé</strong>
                    <p style={{ fontSize: 11, margin: 0, opacity: 0.8 }}>Le système détermine automatiquement l'action (Entrée/Sortie).</p>
                  </div>
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
