import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [effectiveAction, setEffectiveAction] = useState(null);

  const scannerRef = useRef(null);
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const cooldownRef = useRef(cooldown);
  const cooldownTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Keep refs in sync with state for the scanner callback
  useEffect(() => { isAutoModeRef.current = isAutoMode; }, [isAutoMode]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { cooldownRef.current = cooldown; }, [cooldown]);

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
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePointage = useCallback(async (type, empToUse = null) => {
    const targetEmp = empToUse || employe;
    if (!targetEmp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: targetEmp._id,
        scanner_action: type,
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const actionDone = response.data.effectiveAction || type;
      setEffectiveAction(actionDone);

      setMessage({
        type: 'success',
        text: `Pointage d'${actionDone === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${targetEmp.prenom} ${targetEmp.nom}`
      });

      if (isAutoModeRef.current) {
        setCooldown(true);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldown(false);
          setEffectiveAction(null);
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        resetTimeoutRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          setEffectiveAction(null);
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (isAutoModeRef.current) {
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [employe]);

  const onScanSuccess = useCallback(async (result) => {
    // Prevent processing if already loading or in cooldown
    if (loadingRef.current || cooldownRef.current) return;

    if (!isAutoModeRef.current) {
      // Manual mode: stop scanner on success
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      setScanResult(result);
      loadEmploye(result);
    } else {
      // Auto Mode: keep scanner running, but ignore subsequent scans until cooldown is over
      setScanResult(result);
      const emp = await loadEmploye(result);
      if (emp) {
        await handlePointage('auto', emp);
      } else {
        // Clear error message after 2s in auto mode
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    }
  }, [loadEmploye, handlePointage]);

  const onScanError = (err) => {
    // Silent
  };

  useEffect(() => {
    // Initialize scanner once on mount
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });
    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [onScanSuccess]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setEffectiveAction(null);

    // If scanner was cleared (manual mode), restart it
    if (!scannerRef.current || !document.getElementById('reader')?.children.length) {
       const scanner = new Html5QrcodeScanner('reader', {
         qrbox: { width: 250, height: 250 },
         fps: 10,
       });
       scanner.render(onScanSuccess, onScanError);
       scannerRef.current = scanner;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <div className="scanner-controls">
            <span style={{ fontWeight: 600, fontSize: 14 }}>Mode Automatique</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAutoMode}
                onChange={(e) => {
                  setIsAutoMode(e.target.checked);
                  handleReset();
                }}
              />
              <span className="slider"></span>
            </label>
          </div>

          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div className="scanner-cooldown-overlay">
              <div className="cooldown-spinner"></div>
              <div className="cooldown-text">Traitement terminé</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 5 }}>
                Prêt dans quelques secondes...
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

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Poste</label>
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

              {isAutoMode && effectiveAction && (
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  borderRadius: '12px',
                  background: effectiveAction === 'entree' ? 'var(--success-bg)' : 'var(--warning-bg)',
                  color: effectiveAction === 'entree' ? 'var(--success)' : 'var(--warning)',
                  fontWeight: 700,
                  fontSize: '18px',
                  border: `1px solid ${effectiveAction === 'entree' ? 'var(--success)' : 'var(--warning)'}`
                }}>
                  {effectiveAction === 'entree' ? '📥 ENTRÉE CONFIRMÉE' : '📤 SORTIE CONFIRMÉE'}
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
