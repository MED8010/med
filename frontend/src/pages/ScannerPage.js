import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const scannerRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Use refs for state to be used in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const onScanSuccessRef = useRef();
  const loadEmployeRef = useRef();
  const handlePointageRef = useRef();

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    }, false);

    scanner.render((res) => onScanSuccessRef.current(res), (err) => {});
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

  const handlePointage = useCallback(async (targetEmploye, type) => {
    if (!targetEmploye || stateRef.current.loading) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: targetEmploye._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const actionTaken = response.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionTaken === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${targetEmploye.prenom} ${targetEmploye.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldown(false);
          setScanResult(null);
          setEmploye(null);
        }, 3000);
      }

      resetTimeoutRef.current = setTimeout(() => {
        setMessage({ type: '', text: '' });
        if (!stateRef.current.isAutoMode) {
          setEmploye(null);
          setScanResult(null);
          startScanner();
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      setLoading(false);
    } finally {
      if (!stateRef.current.isAutoMode) setLoading(false);
      else {
          // Keep loading false but cooldown handles the rest
          setLoading(false);
      }
    }
  }, [startScanner]);

  const loadEmploye = useCallback(async (matricule) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      if (stateRef.current.isAutoMode) {
        await handlePointage(foundEmploye, 'auto');
      } else {
        await stopScanner();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  }, [handlePointage, stopScanner]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    loadEmployeRef.current = loadEmploye;
    handlePointageRef.current = handlePointage;
  }, [onScanSuccess, loadEmploye, handlePointage]);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [startScanner, stopScanner]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
    setMessage({ type: '', text: '' });
    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    stopScanner().then(() => startScanner());
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="mode-toggle">
           <span style={{ marginRight: 10, fontWeight: 600, color: isAutoMode ? 'var(--success)' : 'var(--text-muted)' }}>
             {isAutoMode ? '⚡ Mode Automatique (Mains-libres)' : '🖱️ Mode Manuel'}
           </span>
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
          <div id="reader" style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-content">
                <div className="check-icon">✓</div>
                <p>Scanner prêt dans quelques secondes...</p>
                <div className="cooldown-progress"></div>
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
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '20px',
                  background: 'var(--grad-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, boxShadow: 'var(--shadow-primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--primary)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item" style={{ marginBottom: 15, background: 'var(--bg-hover)', padding: '12px 16px', borderRadius: 10 }}>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, background: 'var(--bg-hover)', padding: '12px 16px', borderRadius: 10 }}>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-success)', border: 'none', height: 50 }}
                    onClick={() => handlePointage(employe, 'entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-warning)', border: 'none', height: 50 }}
                    onClick={() => handlePointage(employe, 'sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && cooldown && (
                <div className="auto-success-indicator">
                   <div className="pulse-ring"></div>
                   <span>Traitement Automatique Réussi</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.3 }}>🪪</div>
              {scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
              {isAutoMode && <p style={{ fontSize: 12, marginTop: 10 }}>Le pointage sera détecté automatiquement</p>}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mode-toggle {
          display: flex;
          align-items: center;
          background: var(--bg-card);
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 22px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px; width: 16px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(22px); }

        .cooldown-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 14, 26, 0.8);
          backdrop-filter: blur(4px);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          animation: fadeIn 0.3s ease;
        }
        .cooldown-content { text-align: center; color: white; }
        .check-icon {
          width: 60px; height: 60px;
          background: var(--success);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 15px;
          animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .cooldown-progress {
          height: 4px; background: var(--success);
          width: 0%; border-radius: 2px;
          margin-top: 10px;
          animation: progress 3s linear forwards;
        }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }

        .auto-success-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          padding: 12px;
          background: var(--success-bg);
          border-radius: 10px;
          color: var(--success);
          font-weight: 600;
          position: relative;
        }
        .pulse-ring {
          width: 12px; height: 12px;
          background: var(--success);
          border-radius: 50%;
          box-shadow: 0 0 0 var(--success);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease; }
      `}</style>
    </div>
  );
};

export default ScannerPage;
