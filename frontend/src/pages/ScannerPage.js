import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(() => {
    return localStorage.getItem('scanner_auto_mode') === 'true';
  });
  const [cooldown, setCooldown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const scannerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const resetMessageTimerRef = useRef(null);

  // Refs for state to be accessed in stable callbacks
  const stateRef = useRef({
    isAutoMode,
    loading,
    cooldown,
    employe
  });

  useEffect(() => {
    stateRef.current = { isAutoMode, loading, cooldown, employe };
    localStorage.setItem('scanner_auto_mode', isAutoMode);
  }, [isAutoMode, loading, cooldown, employe]);

  const triggerCooldown = useCallback(() => {
    setCooldown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setCooldown(false);
      setScanResult(null);
      setEmploye(null);
    }, 5000);
  }, []);

  const handlePointageInternal = useCallback(async (emp, type) => {
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const { pointage } = response.data;
      const actionLabel = (pointage.effectiveAction || type) === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (stateRef.current.isAutoMode) {
        triggerCooldown();
      } else {
        if (resetMessageTimerRef.current) clearTimeout(resetMessageTimerRef.current);
        resetMessageTimerRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) triggerCooldown();
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerCooldown]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (stateRef.current.isAutoMode) {
        await handlePointageInternal(empData, 'auto');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (stateRef.current.isAutoMode) triggerCooldown();
    } finally {
      setLoading(false);
    }
  }, [handlePointageInternal, triggerCooldown]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.cooldown || stateRef.current.loading) return;

    if (!stateRef.current.isAutoMode) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    }

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const onScanError = useCallback((err) => {
    // Silently ignore scan errors
  }, []);

  // Use refs for the functions to pass to Html5QrcodeScanner
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanErrorRef = useRef(onScanError);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    onScanErrorRef.current = onScanError;
  }, [onScanSuccess, onScanError]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
    }
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(
        (res) => onScanSuccessRef.current(res),
        (err) => onScanErrorRef.current(err)
    );
    scannerRef.current = scanner;
  }, []);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (resetMessageTimerRef.current) clearTimeout(resetMessageTimerRef.current);
    };
  }, [startScanner]);

  const handleManualPointage = (type) => {
    handlePointageInternal(employe, type);
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
    setMessage({ type: '', text: '' });
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    if (resetMessageTimerRef.current) clearTimeout(resetMessageTimerRef.current);
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
          <div className={`status-badge ${isAutoMode ? 'success' : 'warning'}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Mode Auto: {isAutoMode ? 'Activé' : 'Désactivé'}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAutoMode}
                onChange={(e) => setIsAutoMode(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {cooldown && (
              <span className="badge warning animate-pulse">Cooldown actif...</span>
            )}
          </div>
          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}></div>
          {!isAutoMode && scanResult && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}
          {isAutoMode && (
            <div style={{ marginTop: 20, padding: 12, background: 'rgba(99, 102, 241, 0.1)', borderRadius: 8, border: '1px dashed var(--primary)' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--primary)', textAlign: 'center' }}>
                <strong>Mode Automatique</strong> : Le scanner reste actif et enregistre les entrées/sorties intelligemment.
              </p>
            </div>
          )}
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

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
                    onClick={() => handleManualPointage('entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handleManualPointage('sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                 <div style={{ padding: 15, background: 'var(--bg-app)', borderRadius: 8, textAlign: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Traitement automatique en cours...</span>
                 </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              {scanResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                  <div className="spinner-small"></div>
                  <span>Recherche de l'employé...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                  <div style={{ fontSize: 40 }}>📱</div>
                  <span>Veuillez scanner un badge QR code</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: var(--primary);
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(99, 102, 241, 0.1);
          border-top: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}} />
    </div>
  );
};

export default ScannerPage;
