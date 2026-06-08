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

  // We use refs to provide stable callbacks to the scanner without re-initializing it
  const onScanSuccessRef = useRef(null);
  const loadEmployeRef = useRef(null);
  const handlePointageRef = useRef(null);

  // Sync state to refs for use in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((result) => onScanSuccessRef.current(result), (err) => {
      // Quiet errors
    });
    scannerRef.current = scanner;
  }, []);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error("Failed to clear scanner", err);
      }
    }
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      // If Auto Mode, perform pointage immediately
      if (stateRef.current.isAutoMode) {
        await handlePointageRef.current('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);

      // Clear error message after 3 seconds if in auto mode to allow next scan
      if (stateRef.current.isAutoMode) {
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const { effectiveAction } = res.data.pointage;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Handle cooldown and reset
      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        // Manual mode: reset after 3 seconds
        messageTimerRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) {
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [startScanner]);

  const onScanSuccess = useCallback((result) => {
    // Prevent processing if already loading or in cooldown
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (!stateRef.current.isAutoMode) {
      stopScanner();
    }

    setScanResult(result);
    loadEmployeRef.current(result);
  }, [stopScanner]);

  // Assign refs
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    loadEmployeRef.current = loadEmploye;
    handlePointageRef.current = handlePointage;
  }, [onScanSuccess, loadEmploye, handlePointage]);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [startScanner, stopScanner]);

  const toggleAutoMode = () => {
    const nextMode = !isAutoMode;
    setIsAutoMode(nextMode);
    localStorage.setItem('scanner_auto_mode', nextMode.toString());

    // Reset state when toggling
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);

    // If turning off auto mode, ensure scanner is running
    if (!nextMode) {
        startScanner();
    }
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);

    stopScanner().then(() => startScanner());
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: isAutoMode ? 'var(--primary)' : 'var(--text-muted)' }}>
            {isAutoMode ? '⚡ Mode Auto Actif' : 'Manual Mode'}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={toggleAutoMode}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-content">
                <div className="check-icon">✓</div>
                <p>Scan réussi !</p>
                <span>Prêt dans quelques secondes...</span>
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
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}
                 style={{ animation: 'fadeIn 0.3s ease' }}>
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

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Service</label>
                <span style={{ fontWeight: 500 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Poste</label>
                <span style={{ fontWeight: 500 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', justifyContent: 'center' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', justifyContent: 'center' }}
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
              {isAutoMode && <p style={{ fontSize: 12, marginTop: 8 }}>Mode mains-libres activé</p>}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px; width: 16px;
          left: 4px; bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(26px); }
        .slider.round { border-radius: 24px; }
        .slider.round:before { border-radius: 50%; }

        .cooldown-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(99, 102, 241, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          color: white;
          animation: fadeIn 0.3s ease;
        }
        .cooldown-content { text-align: center; }
        .check-icon {
          font-size: 48px;
          margin-bottom: 10px;
          animation: scaleUp 0.3s ease;
        }
        @keyframes scaleUp {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ScannerPage;
