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
  const isAutoModeRef = useRef(isAutoMode);
  const cooldownRef = useRef(false);
  const loadingRef = useRef(false);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
    localStorage.setItem('scanner_auto_mode', isAutoMode);
  }, [isAutoMode]);

  const handlePointage = useCallback(async (employeData, type) => {
    if (!employeData || loadingRef.current) return;

    setLoading(true);
    loadingRef.current = true;
    try {
      const payload = {
        employe_id: employeData._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const action = response.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${employeData.prenom} ${employeData.nom}`
      });

      // Clear existing timeout if any
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

      // Reset after success
      messageTimeoutRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        startScanner();
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      // Restart scanner on error if it was stopped
      startScanner();
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const handlePointageRef = useRef(handlePointage);
  useEffect(() => {
    handlePointageRef.current = handlePointage;
  }, [handlePointage]);

  const loadEmploye = useCallback(async (matricule) => {
    if (loadingRef.current) return;

    setLoading(true);
    loadingRef.current = true;
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const employeData = res.data;
      setEmploye(employeData);

      if (isAutoModeRef.current) {
        await handlePointageRef.current(employeData, 'auto');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      startScanner();
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const loadEmployeRef = useRef(loadEmploye);
  useEffect(() => {
    loadEmployeRef.current = loadEmploye;
  }, [loadEmploye]);

  const onScanSuccess = useCallback((result) => {
    if (cooldownRef.current || loadingRef.current) return;

    // Cooldown to prevent multiple scans
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

  const startScanner = useCallback(() => {
    // If there is an existing scanner, clear it first
    const readerElement = document.getElementById('reader');
    if (!readerElement) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render((result) => onScanSuccessRef.current(result), (err) => {
      // console.warn(err);
    });
    scannerRef.current = scanner;
  }, []);

  useEffect(() => {
    startScanner();
    return () => {
      const currentScanner = scannerRef.current;
      const currentTimeout = messageTimeoutRef.current;
      if (currentScanner) {
        currentScanner.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (currentTimeout) clearTimeout(currentTimeout);
    };
  }, [startScanner]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Mode Auto</span>
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
      </div>

      <div className="grid-2">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {isAutoMode && <span className="badge badge-success">Auto-validation active</span>}
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

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handlePointage(employe, 'entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage(employe, 'sortie')}
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
