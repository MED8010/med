import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(() => {
    return localStorage.getItem('scanner_auto_mode') === 'true';
  });
  const scannerRef = useRef(null);
  const cooldownRef = useRef(false);
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);

  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
    localStorage.setItem('scanner_auto_mode', isAutoMode);
  }, [isAutoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

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

    scanner.render((result) => onScanSuccessRef.current(result), onScanError);
    scannerRef.current = scanner;
  };

  const onScanSuccess = useCallback((result) => {
    if (cooldownRef.current || loadingRef.current) return;

    // Activer le cooldown de 5 secondes
    cooldownRef.current = true;
    setTimeout(() => {
      cooldownRef.current = false;
    }, 5000);

    if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmployeRef.current(result);
  }, []);

  const onScanSuccessRef = useRef(onScanSuccess);
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  const onScanError = (err) => {
    // console.warn(err);
  };

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (isAutoModeRef.current) {
        handlePointage('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      // Restart scanner if not found if not in auto mode
      if (!isAutoModeRef.current) {
        startScanner();
      } else {
        setTimeout(() => {
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEmployeRef = useRef(loadEmploye);
  useEffect(() => {
    loadEmployeRef.current = loadEmploye;
  }, [loadEmploye]);

  const handlePointage = async (type, targetEmploye = null) => {
    const emp = targetEmploye || employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const effectiveAction = res.data.pointage.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Reset after success
      setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        // In both modes, we want to be ready for the next scan.
        // For Html5QrcodeScanner, we need to re-render it if it was cleared.
        startScanner();
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        startScanner();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {}).finally(() => {
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
      </div>

      <div className="grid-2">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: isAutoMode ? 'var(--success)' : 'var(--text-muted)' }}>
                {isAutoMode ? 'MODE AUTO ON' : 'MODE MANUEL'}
              </span>
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
          <div id="reader" style={{ width: '100%' }}></div>
          {scanResult && (
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
