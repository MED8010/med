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
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  };

  const onScanSuccess = (result) => {
    // Check refs to avoid race conditions and stale closures
    if (loadingRef.current || cooldownRef.current) return;

    if (isAutoModeRef.current) {
      handleAutoPointage(result);
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      setScanResult(result);
      loadEmploye(result);
    }
  };

  const onScanError = (err) => {
    // Silent error
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
    setCooldown(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Get Employee
      const empRes = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = empRes.data;
      setEmploye(empData);

      // 2. Do Pointage Auto
      const payload = {
        employe_id: empData._id,
        scanner_action: 'auto',
        absence: false
      };

      const pointageRes = await apiClient.post('/pointages', payload);
      const action = pointageRes.data.effectiveAction;

      setMessage({
        type: 'success',
        text: `[AUTO] Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${empData.prenom} ${empData.nom}`
      });

      // Cooldown for 3 seconds before next scan
      setTimeout(() => {
        setCooldown(false);
        setEmploye(null);
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du pointage automatique' });
      setTimeout(() => {
        setCooldown(false);
        setMessage({ type: '', text: '' });
      }, 2000);
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

      setTimeout(() => {
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
    setCooldown(false);
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
        <div className="d-flex align-center gap-12">
           <span style={{ fontWeight: 600, fontSize: '13px' }}>Mode Automatique</span>
           <label className="switch">
              <input
                type="checkbox"
                checked={isAutoMode}
                onChange={() => {
                  setIsAutoMode(!isAutoMode);
                  handleReset();
                }}
              />
              <span className="slider round"></span>
           </label>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}></div>

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

          {isAutoMode && (
            <div style={{ marginTop: 15, padding: '10px', background: 'var(--primary-glow)', borderRadius: '8px', color: 'var(--primary)', fontSize: '12px', textAlign: 'center', fontWeight: 600 }}>
              ⚡ Mode Mains Libres Activé
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
                  background: 'var(--grad-primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800, boxShadow: 'var(--shadow-primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                <label style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                <label style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    📥 Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    📤 Sortie
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🪪</div>
              <p style={{ fontWeight: 500 }}>
                {scanResult ? 'Recherche en cours...' : 'Veuillez présenter un badge QR code devant la caméra'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
