import React, { useState, useEffect, useRef } from 'react';
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
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const cooldownRef = useRef(cooldown);

  // Sync refs with state to use in scanner callback without re-rendering scanner
  useEffect(() => { isAutoModeRef.current = isAutoMode; }, [isAutoMode]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { cooldownRef.current = cooldown; }, [cooldown]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  };

  const onScanSuccess = (result) => {
    // Prevent multiple scans if already processing or in cooldown
    if (loadingRef.current || cooldownRef.current) return;

    setScanResult(result);

    if (isAutoModeRef.current) {
      handleAutoPointage(result);
    } else {
      // In manual mode, we clear scanner to show info
      if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      loadEmploye(result);
    }
  };

  const onScanError = (err) => {
    // console.warn(err);
  };

  const loadEmploye = async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      startScanner();
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPointage = async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Get employee first
      const empRes = await apiClient.get(`/employes/matricule/${matricule}`);
      const emp = empRes.data;
      setEmploye(emp);

      // 2. Perform auto pointage
      const payload = {
        employe_id: emp._id,
        scanner_action: 'auto',
      };

      const res = await apiClient.post('/pointages', payload);
      const { effectiveAction } = res.data;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} auto pour ${emp.prenom} ${emp.nom}`
      });

      // 3. Trigger Cooldown
      setCooldown(true);
      setTimeout(() => {
        setCooldown(false);
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du pointage automatique' });
      setCooldown(true);
      setTimeout(() => {
        setCooldown(false);
        setMessage({ type: '', text: '' });
        setScanResult(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleManualPointage = async (type) => {
    if (!employe) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: employe._id,
        scanner_action: type,
      };

      await apiClient.post('/pointages', payload);
      setMessage({
        type: 'success',
        text: `Pointage d'${type === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${employe.prenom} ${employe.nom}`
      });

      setTimeout(() => {
        handleReset();
      }, 2000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du pointage' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    if (scannerRef.current) {
        scannerRef.current.clear().then(() => startScanner()).catch(() => startScanner());
    } else {
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

        <div className="mode-toggle" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Mode Auto</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={(e) => {
                setIsAutoMode(e.target.checked);
                if (!e.target.checked && !scannerRef.current) {
                  // If switching back to manual and scanner was cleared
                  handleReset();
                }
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 {isAutoMode ? 'Scanner Auto' : 'Scanner Manuel'}</h3>

          <div id="reader" style={{ width: '100%', border: 'none', borderRadius: 12, overflow: 'hidden' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="spinner"></div>
              <p>Traitement terminé. Prêt dans 3s...</p>
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
          <h3>👤 Statut Scanner</h3>
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

              <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <label style={{ color: 'var(--text-muted)' }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 20 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handleManualPointage('entree')}
                    disabled={loading}
                  >
                    📥 Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handleManualPointage('sortie')}
                    disabled={loading}
                  >
                    📤 Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div style={{ textAlign: 'center', padding: '20px', background: 'var(--primary-glow)', borderRadius: 12 }}>
                   <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700 }}>Traitement automatique...</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              {isAutoMode
                ? 'Le scanner traitera automatiquement chaque badge présenté.'
                : (scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
