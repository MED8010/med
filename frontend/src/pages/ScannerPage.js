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

  // Refs to access latest state in stable callbacks
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const cooldownRef = useRef(cooldown);
  const employeRef = useRef(employe);

  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
    localStorage.setItem('scanner_auto_mode', isAutoMode);
  }, [isAutoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    cooldownRef.current = cooldown;
  }, [cooldown]);

  useEffect(() => {
    employeRef.current = employe;
  }, [employe]);


  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || employeRef.current;
    if (!emp || loadingRef.current) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const effectiveAction = res.data.pointage?.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Cooldown to prevent double scans
      setCooldown(true);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
      }, 5000);

      // Auto reset UI
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        if (!scannerRef.current) {
          try {
            const scanner = new Html5QrcodeScanner('reader', {
              qrbox: { width: 280, height: 280 },
              fps: 10,
            });
            scanner.render((res) => onScanSuccessRef.current(res), (err) => {});
            scannerRef.current = scanner;
          } catch (e) {}
        }
      }, 4000);

    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors de l\'enregistrement du pointage'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    if (loadingRef.current || cooldownRef.current) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      if (isAutoModeRef.current) {
        await handlePointage('auto', foundEmploye);
      } else {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
          scannerRef.current = null;
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  }, [handlePointage]);

  const onScanSuccess = useCallback((result) => {
    if (loadingRef.current || cooldownRef.current) return;
    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const onScanSuccessRef = useRef(onScanSuccess);
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 280, height: 280 },
      fps: 10,
    });

    scanner.render((res) => onScanSuccessRef.current(res), (err) => {});
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        scannerRef.current = null;
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const handleManualReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        const scanner = new Html5QrcodeScanner('reader', {
          qrbox: { width: 280, height: 280 },
          fps: 10,
        });
        scanner.render((res) => onScanSuccessRef.current(res), (err) => {});
        scannerRef.current = scanner;
      }).catch(() => {
        const scanner = new Html5QrcodeScanner('reader', {
          qrbox: { width: 280, height: 280 },
          fps: 10,
        });
        scanner.render((res) => onScanSuccessRef.current(res), (err) => {});
        scannerRef.current = scanner;
      });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div className="mode-toggle-card" style={{
          background: 'var(--bg-card)',
          padding: '10px 20px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 15
        }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Mode Automatique</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={() => setIsAutoMode(!isAutoMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3>📷 Scanner</h3>
            {cooldown && <span className="badge badge-warning">Attente 5s...</span>}
          </div>

          <div id="reader" style={{
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            border: cooldown ? '4px solid var(--warning)' : '4px solid transparent',
            transition: 'border-color 0.3s ease'
          }}></div>

          {cooldown && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div className="spinner"></div>
            </div>
          )}

          {scanResult && !isAutoMode && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleManualReset}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}
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
                  fontSize: 24, fontWeight: 800,
                  border: '2px solid var(--primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Service</label>
                <span style={{ fontWeight: 500 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Poste</label>
                <span style={{ fontWeight: 500 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', padding: '15px' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', padding: '15px' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div className="info-message" style={{ textAlign: 'center', display: 'block' }}>
                  Traitement automatique en cours...
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.3 }}>🪪</div>
              <p>{scanResult ? 'Identification...' : 'Veuillez scanner un badge QR code'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
