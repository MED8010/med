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
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  const cooldownTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Sync state to ref for stable callbacks
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const onScanSuccessRef = useRef(null);
  const loadEmployeRef = useRef(null);
  const handlePointageRef = useRef(null);

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });
    // Use refs to stable callbacks to prevent scanner re-renders
    scanner.render((res) => onScanSuccessRef.current(res), (err) => {});
    scannerRef.current = scanner;
  }, []);

  const handleReset = useCallback(() => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);

    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        startScanner();
      }).catch(() => {
        startScanner();
      });
    } else {
      startScanner();
    }
  }, [startScanner]);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionType = res.data.effectiveAction || (type === 'auto' ? 'entree' : type);

      setMessage({
        type: 'success',
        text: `Pointage d'${actionType === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
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
      if (stateRef.current.isAutoMode) {
        resetTimeoutRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [startScanner]);

  handlePointageRef.current = handlePointage;

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (stateRef.current.isAutoMode) {
        handlePointageRef.current('auto', empData);
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
  }, [startScanner]);

  loadEmployeRef.current = loadEmploye;

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (!stateRef.current.isAutoMode) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    }

    setScanResult(result);
    loadEmployeRef.current(result);
  }, []);

  onScanSuccessRef.current = onScanSuccess;

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

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 600 }}>Mode Automatique</span>
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

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-spinner"></div>
              <p style={{ fontWeight: 700 }}>Traitement en cours...</p>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Veuillez patienter 3 secondes</p>
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
