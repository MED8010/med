import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(() => {
    return localStorage.getItem('scanner_auto_mode') === 'true';
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const scannerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const messageTimerRef = useRef(null);

  // Refs for stable callbacks
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const cooldownRef = useRef(cooldown);
  const employeRef = useRef(employe);

  // Refs for functions to avoid dependency cycles
  const startScannerRef = useRef(null);
  const handlePointageRef = useRef(null);
  const loadEmployeRef = useRef(null);
  const onScanSuccessRef = useRef(null);

  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
    localStorage.setItem('scanner_auto_mode', isAutoMode);
  }, [isAutoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    cooldownRef.current = cooldown;
  }, [cooldown]);

  useEffect(() => {
    employeRef.current = employe;
  }, [employe]);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || employeRef.current;
    if (!emp || loadingRef.current) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' ou 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);

      const actionTaken = res.data.pointage.effectiveAction || type;
      const actionLabel = actionTaken === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Activate cooldown
      setCooldown(true);
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
      }, 5000);

      // Auto-reset message and employe after 3s
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        if (!isAutoModeRef.current && startScannerRef.current) {
           startScannerRef.current();
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);
  handlePointageRef.current = handlePointage;

  const loadEmploye = useCallback(async (matricule) => {
    if (loadingRef.current || cooldownRef.current) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      if (isAutoModeRef.current && handlePointageRef.current) {
        await handlePointageRef.current('auto', foundEmploye);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!isAutoModeRef.current && startScannerRef.current) {
        startScannerRef.current();
      }
    } finally {
      setLoading(false);
    }
  }, []);
  loadEmployeRef.current = loadEmploye;

  const onScanSuccess = useCallback((result) => {
    if (loadingRef.current || cooldownRef.current) return;

    if (!isAutoModeRef.current && scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    if (loadEmployeRef.current) {
      loadEmployeRef.current(result);
    }
  }, []);
  onScanSuccessRef.current = onScanSuccess;

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render((res) => onScanSuccessRef.current(res), (err) => {});
    scannerRef.current = scanner;
  }, []);
  startScannerRef.current = startScanner;

  useEffect(() => {
    if (startScannerRef.current) {
      startScannerRef.current();
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    if (startScannerRef.current) {
      startScannerRef.current();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div className="scanner-controls">
          <label className="switch-container">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={(e) => setIsAutoMode(e.target.checked)}
            />
            <span className="switch-slider"></span>
            <span className="switch-label">Mode Automatique</span>
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
                <div className="spinner"></div>
                <p>Initialisation...</p>
                <small>Patientez 5s entre deux scans</small>
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
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'} animate-fade-in`}>
              {message.type === 'success' ? '✅' : '❌'} {message.text}
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
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div className="auto-mode-badge">
                  ⚡ Mode automatique activé
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
