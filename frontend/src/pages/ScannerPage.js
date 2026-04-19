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
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const cooldownRef = useRef(cooldown);
  const cooldownTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Keep refs in sync with state for the scanner callback
  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
  }, [isAutoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    cooldownRef.current = cooldown;
  }, [cooldown]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const processAutoScan = async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const empRes = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = empRes.data;
      setEmploye(empData);

      const res = await apiClient.post('/pointages', {
        employe_id: empData._id,
        scanner_action: 'auto',
        absence: false
      });

      const action = res.data.effectiveAction;
      setMessage({
        type: 'success',
        text: `Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} auto pour ${empData.prenom} ${empData.nom}`
      });

      // Activate cooldown to prevent accidental double-scans
      setCooldown(true);
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldown(false);
        setEmploye(null);
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Badge invalide ou erreur système' });
      setCooldown(true);
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldown(false);
        setMessage({ type: '', text: '' });
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const onScanSuccess = useCallback(async (result) => {
    if (loadingRef.current || cooldownRef.current) return;

    if (isAutoModeRef.current) {
      await processAutoScan(result);
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      setScanResult(result);
      loadEmploye(result);
    }
  }, []);

  const onScanError = (err) => {
    // console.warn(err);
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [onScanSuccess]);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
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

  const handlePointage = async (type) => {
    if (!employe) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: employe._id,
        scanner_action: type,
        absence: false
      };

      await apiClient.post('/pointages', payload);
      setMessage({
        type: 'success',
        text: `Pointage d'${type === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${employe.prenom} ${employe.nom}`
      });

      resetTimeoutRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        startScanner();
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
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
        <div className="auto-mode-toggle">
          <span style={{ marginRight: 10, fontWeight: 600, fontSize: 14 }}>Mode Automatique</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={(e) => {
                setIsAutoMode(e.target.checked);
                if (!e.target.checked && !scanResult) {
                  // If switching back to manual and nothing scanned, ensure scanner is running
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
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-content">
                <div className="check-icon">✓</div>
                <p>Scan réussi</p>
                <div className="cooldown-timer"></div>
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

              <div className="detail-item" style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Service</label>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Poste</label>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
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
                <div style={{
                  padding: '15px',
                  background: 'var(--primary-glow)',
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: 'var(--primary)',
                  fontWeight: 600
                }}>
                  Traitement automatique activé
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
