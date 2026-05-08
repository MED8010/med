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

  // Keep refs up to date for the scanner callback
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const currentEmploye = targetEmploye || stateRef.current.employe;
    if (!currentEmploye) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: currentEmploye._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionTaken = res.data.pointage?.effectiveAction || (type === 'auto' ? 'pointage' : type);

      setMessage({
        type: 'success',
        text: `Pointage d'${actionTaken === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${currentEmploye.prenom} ${currentEmploye.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldown(false);
          setScanResult(null);
          setEmploye(null);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        resetTimeoutRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointageRef = useRef(handlePointage);
  useEffect(() => {
    handlePointageRef.current = handlePointage;
  }, [handlePointage]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      // If auto mode, proceed with pointage immediately
      if (stateRef.current.isAutoMode) {
        handlePointageRef.current('auto', res.data);
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
  }, [handlePointage]);

  const loadEmployeRef = useRef(loadEmploye);
  useEffect(() => {
    loadEmployeRef.current = loadEmploye;
  }, [loadEmploye]);

  const onScanSuccess = useCallback((result) => {
    // Prevent multiple scans during loading or cooldown
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (!stateRef.current.isAutoMode && scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmployeRef.current(result);
  }, []);

  const onScanSuccessRef = useRef(onScanSuccess);
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((result) => onScanSuccessRef.current(result), (err) => {});
    scannerRef.current = scanner;
  }, []);

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
    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    startScanner();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, background: 'var(--bg-card)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Mode Mains-Libres</span>
          <label className="toggle-switch">
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
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner {isAutoMode && <span className="badge badge-success" style={{ marginLeft: 10 }}>AUTO</span>}</h3>

          <div style={{ position: 'relative' }}>
            <div id="reader" style={{ width: '100%' }}></div>
            {cooldown && (
              <div className="cooldown-overlay">
                <div className="cooldown-spinner"></div>
                <p style={{ fontWeight: 700 }}>Traitement terminé</p>
                <p style={{ fontSize: '12px' }}>Prêt dans quelques secondes...</p>
              </div>
            )}
          </div>

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
                <span style={{ fontWeight: 700 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Poste</label>
                <span style={{ fontWeight: 700 }}>{employe.poste || 'Collaborateur'}</span>
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
                <div style={{ textAlign: 'center', padding: '15px', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)', fontWeight: 700 }}>
                  ⚡ Pointage automatique en cours...
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              {scanResult && !message.text ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
