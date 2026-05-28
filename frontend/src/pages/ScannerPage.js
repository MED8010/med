import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(() => {
    return localStorage.getItem('scanner_auto_mode') === 'true';
  });

  const scannerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Keep refs of state to avoid re-renders in callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (emp, type) => {
    if (!emp || stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionTaken = res.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionTaken === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Activate cooldown
      setCooldown(true);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
        if (!stateRef.current.isAutoMode) {
           setEmploye(null);
           setScanResult(null);
        }
      }, 3000);

      // Auto clear message after 5s
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
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

      // In auto mode, trigger pointage automatically
      if (stateRef.current.isAutoMode) {
        handlePointage(empData, 'auto');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  }, [handlePointage]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    // Only load if it's a new result or we are ready
    if (result !== scanResult) {
      setScanResult(result);
      loadEmploye(result);
    }
  }, [scanResult, loadEmploye]);

  // Sync callbacks to refs to avoid scanner restart on dependency change
  const onScanSuccessRef = useRef(onScanSuccess);
  const loadEmployeRef = useRef(loadEmploye);
  const handlePointageRef = useRef(handlePointage);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    loadEmployeRef.current = loadEmploye;
    handlePointageRef.current = handlePointage;
  }, [onScanSuccess, loadEmploye, handlePointage]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((result) => onScanSuccessRef.current(result), (err) => {});
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const handleToggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="action-buttons">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', padding: '10px 15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: isAutoMode ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {isAutoMode ? '⚡ MODE AUTO ACTIF' : '👆 MODE MANUEL'}
                </span>
                <label className="switch">
                    <input type="checkbox" checked={isAutoMode} onChange={handleToggleAutoMode} />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
              <div className="cooldown-overlay">
                  <div className="spinner"></div>
                  <p>Traitement terminé. Prêt dans 3s...</p>
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
          {loading && !cooldown && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: '20px' }}>
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

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Service</label>
                <span style={{ fontWeight: '600' }}>{employe.service?.nom_service || 'N/A'}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Poste</label>
                <span style={{ fontWeight: '600' }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handlePointage(employe, 'entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage(employe, 'sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                  <div style={{ textAlign: 'center', padding: '20px', background: 'var(--primary-glow)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--primary)' }}>
                      <p style={{ margin: 0, color: 'var(--primary)', fontWeight: '700' }}>✨ Traitement Automatique Activé</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Le système détecte l'action appropriée (Entrée/Sortie)</p>
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
