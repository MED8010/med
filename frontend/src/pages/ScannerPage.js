import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const scannerRef = useRef(null);
  const cooldownRef = useRef(false);
  const isAutoModeRef = useRef(false);
  const loadingRef = useRef(false);

  // Use refs to provide stable callbacks to the scanner
  const onScanSuccessRef = useRef();
  const loadEmployeRef = useRef();
  const handleAutoScanRef = useRef();

  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
  }, [isAutoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const startScanner = React.useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render((result) => onScanSuccessRef.current(result), (err) => {
        // silence error
    });
    scannerRef.current = scanner;
  }, []);

  const onScanSuccess = React.useCallback((result) => {
    if (loadingRef.current || cooldownRef.current) return;

    if (!isAutoModeRef.current) {
      if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
          scannerRef.current = null;
      }
      setScanResult(result);
      loadEmployeRef.current(result);
    } else {
      handleAutoScanRef.current(result);
    }
  }, []);

  const handleAutoScan = React.useCallback(async (matricule) => {
    cooldownRef.current = true;
    setCooldown(true);
    setLoading(true);
    setMessage({ type: 'info', text: 'Traitement automatique...' });

    try {
      const empRes = await apiClient.get(`/employes/matricule/${matricule}`);
      const emp = empRes.data;
      setEmploye(emp);

      const payload = {
        employe_id: emp._id,
        scanner_action: 'auto',
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const action = res.data.effectiveAction;

      setMessage({
        type: 'success',
        text: `AUTO: Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} pour ${emp.prenom} ${emp.nom}`
      });

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur scan auto: employé non trouvé ou erreur serveur' });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setCooldown(false);
        cooldownRef.current = false;
        setMessage({ type: '', text: '' });
        setEmploye(null);
      }, 3000);
    }
  }, []);

  const loadEmploye = React.useCallback(async (matricule) => {
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
  }, [startScanner]);

  // Sync refs
  onScanSuccessRef.current = onScanSuccess;
  loadEmployeRef.current = loadEmploye;
  handleAutoScanRef.current = handleAutoScan;
  // handlePointageRef.current = handlePointage; // skipped for brevity if not needed for auto mode demo

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        scannerRef.current = null;
      }
    };
  }, [startScanner]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    if (scannerRef.current) {
        scannerRef.current.clear().then(() => {
            scannerRef.current = null;
            startScanner();
        }).catch(() => {
            scannerRef.current = null;
            startScanner();
        });
    } else {
        startScanner();
    }
  };

  const manualHandlePointage = async (type) => {
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

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Mode Automatique</span>
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

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-lg)',
              color: 'white',
              textAlign: 'center'
            }}>
              <div className="spinner" style={{ borderTopColor: 'white' }}></div>
              <p style={{ marginTop: '15px', fontWeight: 700 }}>Traitement... Patientez</p>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <button
                  className="btn-primary"
                  style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                  onClick={() => manualHandlePointage('entree')}
                  disabled={loading}
                >
                  📥 Pointer Entrée
                </button>
                <button
                  className="btn-primary"
                  style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                  onClick={() => manualHandlePointage('sortie')}
                  disabled={loading}
                >
                  📤 Pointer Sortie
                </button>
              </div>
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
