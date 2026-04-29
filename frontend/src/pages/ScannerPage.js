import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const scannerRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Use a ref for values used inside callbacks to avoid stale closures
  // and unnecessary re-initialization of the scanner.
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const startScanner = React.useCallback(() => {
    // Check if scanner is already running or being cleared
    const readerElement = document.getElementById('reader');
    if (!readerElement) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handlePointage = React.useCallback(async (type, targetEmploye = null) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp) return;

    setLoading(true);
    setCooldown(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionLabel = res.data.effectiveAction === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Clear cooldown and info after 3 seconds
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldown(false);
      }, 3000);

      resetTimeoutRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        if (!stateRef.current.isAutoMode) {
          startScanner();
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
      setCooldown(false);
    } finally {
      setLoading(false);
    }
  }, [startScanner]);

  const loadEmploye = React.useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      // Auto-trigger if mode is ON
      if (stateRef.current.isAutoMode) {
        handlePointage('auto', foundEmploye);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou badge invalide' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode) {
        startScanner();
      }
    } finally {
      setLoading(false);
    }
  }, [handlePointage, startScanner]);

  const onScanSuccess = React.useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    // In auto mode, we don't clear the scanner immediately,
    // we use a cooldown to prevent double scans.
    if (!stateRef.current.isAutoMode) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    }

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const onScanError = React.useCallback((err) => {
    // console.warn(err);
  }, []);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
    setMessage({ type: '', text: '' });
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        startScanner();
      }).catch(() => {
        startScanner();
      });
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
        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Mode Automatique</span>
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
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {isAutoMode && <span className="badge badge-success">Auto ON</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="spinner"></div>
              <p>Traitement en cours...</p>
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
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 5 }}>{message.type === 'success' ? '✅' : '❌'}</div>
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '20px',
                  background: 'var(--primary-glow)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, fontWeight: 800,
                  boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item" style={{ marginBottom: 15, padding: '12px', background: 'var(--bg-body)', borderRadius: 10 }}>
                <label style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, padding: '12px', background: 'var(--bg-body)', borderRadius: 10 }}>
                <label style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', height: 50 }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', height: 50 }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.3 }}>🪪</div>
              {scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
              {isAutoMode && <p style={{ fontSize: 12, marginTop: 10 }}>Le pointage sera effectué automatiquement</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
