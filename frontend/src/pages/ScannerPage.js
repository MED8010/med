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

  // Use refs to mirror state so they're accessible inside the scanner callback
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const cooldownRef = useRef(cooldown);

  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
    loadingRef.current = loading;
    cooldownRef.current = cooldown;
  }, [isAutoMode, loading, cooldown]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
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
    // Prevent scanning if already processing or in cooldown
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
      // Restart scanner if not found
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
        // 1. Get employee
        const empRes = await apiClient.get(`/employes/matricule/${matricule}`);
        const emp = empRes.data;
        setEmploye(emp);

        // 2. Perform auto pointage
        const payload = {
            employe_id: emp._id,
            scanner_action: 'auto',
            absence: false
        };

        const res = await apiClient.post('/pointages', payload);
        const action = res.data.effectiveAction;

        setMessage({
            type: 'success',
            text: `Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
        });

        // 3. Clear and wait for cooldown
        setTimeout(() => {
            setEmploye(null);
            setMessage({ type: '', text: '' });
            setCooldown(false);
        }, 3000);

    } catch (err) {
        setMessage({ type: 'error', text: 'Erreur lors du pointage automatique' });
        setTimeout(() => {
            setCooldown(false);
            setMessage({ type: '', text: '' });
            setEmploye(null);
        }, 3000);
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
        scanner_action: type, // 'entree' or 'sortie'
        absence: false
      };

      await apiClient.post('/pointages', payload);
      setMessage({
        type: 'success',
        text: `Pointage d'${type === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${employe.prenom} ${employe.nom}`
      });

      // Reset after success
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Mode Automatique</span>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={isAutoMode}
                    onChange={(e) => {
                        setIsAutoMode(e.target.checked);
                        if (!e.target.checked && !scannerRef.current) {
                            startScanner();
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
              <div className="loading-overlay" style={{ background: 'rgba(0,0,0,0.4)', color: 'white', flexDirection: 'column' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: 15, fontWeight: 700 }}>Traitement... Patientez</p>
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
