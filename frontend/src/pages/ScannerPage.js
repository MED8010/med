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
  const cooldownRef = useRef(false);
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(false);
  const timerRef = useRef(null);
  const msgTimerRef = useRef(null);

  // Sync refs with state
  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
    localStorage.setItem('scanner_auto_mode', isAutoMode);
  }, [isAutoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const handleReset = useCallback(() => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    if (timerRef.current) clearTimeout(timerRef.current);
    if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
  }, []);

  const handlePointage = useCallback(async (type, targetEmploye) => {
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
      const effectiveAction = res.data.pointage.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Clear info after 3s
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
      msgTimerRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setLoading(false);
    }
  }, [employe]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);
      return res.data;
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
      msgTimerRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const onScanSuccess = useCallback(async (result) => {
    if (cooldownRef.current || loadingRef.current) return;

    // Activate cooldown
    setCooldown(true);
    cooldownRef.current = true;
    setTimeout(() => {
      setCooldown(false);
      cooldownRef.current = false;
    }, 5000);

    setScanResult(result);
    const emp = await loadEmploye(result);

    if (emp && isAutoModeRef.current) {
      await handlePointage('auto', emp);
    }
  }, [loadEmploye, handlePointage]);

  const onScanError = useCallback((err) => {
    // console.warn(err);
  }, []);

  // Use refs for callbacks to pass to scanner initialization
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanErrorRef = useRef(onScanError);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    onScanErrorRef.current = onScanError;
  }, [onScanSuccess, onScanError]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render((res) => onScanSuccessRef.current(res), (err) => onScanErrorRef.current(err));
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
    };
  }, []); // Only once

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="header-actions">
           <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: 'var(--bg-card)', padding: '8px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
             <span style={{ fontWeight: 600, fontSize: 14 }}>Mode Auto</span>
             <input
               type="checkbox"
               checked={isAutoMode}
               onChange={(e) => setIsAutoMode(e.target.checked)}
               style={{ width: 18, height: 18, cursor: 'pointer' }}
             />
           </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {cooldown && (
              <span style={{ background: 'var(--warning-glow)', color: 'var(--warning)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                SCAN BLOQUÉ (5s)
              </span>
            )}
          </div>
          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: 'none' }}></div>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button className="btn-secondary" onClick={handleReset}>
              🔄 Réinitialiser
            </button>
          </div>
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
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

              {!isAutoMode ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', color: 'white' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', color: 'white' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', background: 'var(--primary-glow)', borderRadius: 12, color: 'var(--primary)', fontWeight: 700, border: '1px dashed var(--primary)' }}>
                   ✨ TRAITEMENT AUTOMATIQUE ✨
                   <div style={{ fontSize: 12, fontWeight: 400, marginTop: 4, opacity: 0.8 }}>Détection Entrée/Sortie Intelligente</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.2 }}>🪪</div>
              {scanResult ? 'Recherche des informations...' : 'Veuillez présenter votre badge QR code devant la caméra'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
