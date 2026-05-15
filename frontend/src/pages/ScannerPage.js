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
  const cooldownTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Use refs to access latest state in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      // If auto mode, proceed to pointage immediately
      if (stateRef.current.isAutoMode) {
        handlePointage('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode) {
        startScanner();
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointage = async (type, targetEmploye) => {
    const emp = targetEmploye || employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const action = res.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Trigger cooldown
      setCooldown(true);
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldown(false);
      }, 3000);

      // Auto reset UI
      resetTimeoutRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        if (!stateRef.current.isAutoMode) {
          startScanner();
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  };

  const onScanSuccess = useCallback((result) => {
    // Prevent processing if loading or in cooldown
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    // In manual mode, we clear scanner on success. In auto, we keep it running.
    if (!stateRef.current.isAutoMode) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    }

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const startScanner = useCallback(() => {
    // If already initialized, don't re-init
    if (document.getElementById('reader')?.children?.length > 0) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, (err) => {});
    scannerRef.current = scanner;
  }, [onScanSuccess]);

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

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
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

  const toggleAutoMode = () => {
    const nextMode = !isAutoMode;
    setIsAutoMode(nextMode);

    // If switching to auto, ensure scanner is running
    if (nextMode) {
      setEmploye(null);
      setScanResult(null);
      setMessage({ type: '', text: '' });
      startScanner();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Système de Pointage Intelligent v2.0</p>
        </div>
        <div className="section-card" style={{ padding: '10px 20px' }}>
          <label className="toggle-container">
            <span style={{ fontWeight: 600, fontSize: 13 }}>Mode Automatique</span>
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={toggleAutoMode}
              style={{ display: 'none' }}
            />
            <div className="toggle-switch"></div>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ margin: 0 }}>📷 Caméra</h3>
            {isAutoMode && <span className="badge badge-success">Auto-Détection Active</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}></div>

          {cooldown && (
            <div className="cooldown-overlay fadeIn">
              <div style={{ textAlign: 'center' }}>
                <div className="cooldown-spinner" style={{ margin: '0 auto 10px' }}></div>
                <p style={{ fontWeight: 700, color: 'var(--primary)', margin: 0 }}>Traitement...</p>
              </div>
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
          <h3>👤 Résultat du Scan</h3>
          {loading && !cooldown && <div className="spinner" style={{ margin: '20px auto' }}></div>}

          {message.text && (
            <div className={`message fadeIn ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
              {message.type === 'success' ? '✅ ' : '❌ '} {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: 15, background: 'var(--bg-hover)', borderRadius: 12 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'var(--grad-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, boxShadow: 'var(--shadow-sm)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item" style={{ marginBottom: 12 }}>
                <label>Service</label>
                <span className="badge badge-info">{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24 }}>
                <label>Poste</label>
                <span>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', padding: '12px' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', padding: '12px' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div style={{ textAlign: 'center', padding: '10px', background: 'var(--success-bg)', borderRadius: 8, color: 'var(--success)', fontWeight: 600 }}>
                  Pointage automatique en cours...
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 15 }}>🪪</div>
              {scanResult ? 'Identification...' : 'Veuillez présenter votre badge QR Code face à la caméra'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
