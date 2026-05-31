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

  // Use refs to provide stable callbacks to the scanner without restarts
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (type, targetEmploye = null) => {
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
      const { effectiveAction } = res.data;

      setMessage({
        type: 'success',
        text: `Pointage d'${effectiveAction === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
        }, 3000);
      }

      // Clear message after 5 seconds
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 5000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (stateRef.current.isAutoMode) {
          setCooldown(true);
          setTimeout(() => setCooldown(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (stateRef.current.isAutoMode) {
        // Auto-submit in auto mode
        handlePointage('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (stateRef.current.isAutoMode) {
          setCooldown(true);
          setTimeout(() => setCooldown(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [handlePointage]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const onScanError = useCallback((err) => {
    // console.warn(err);
  }, []);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
      rememberLastUsedCamera: true
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [onScanSuccess, onScanError]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
  };

  const toggleAutoMode = () => {
    const next = !isAutoMode;
    setIsAutoMode(next);
    localStorage.setItem('scanner_auto_mode', next.toString());
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="header-actions">
           <div className="mode-toggle-container">
              <span className={`mode-label ${!isAutoMode ? 'active' : ''}`}>Manuel</span>
              <label className="switch">
                <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
                <span className="slider round"></span>
              </label>
              <span className={`mode-label ${isAutoMode ? 'active' : ''}`}>Auto 🤖</span>
           </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card scanner-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ margin: 0 }}>📷 Caméra de Surveillance</h3>
            {cooldown && <span className="cooldown-badge">COOLDOWN</span>}
          </div>

          <div className="scanner-viewport-container">
            <div id="reader" style={{ width: '100%' }}></div>
            {cooldown && (
              <div className="cooldown-overlay">
                <div className="spinner"></div>
                <p>Traitement terminé. Prêt dans quelques secondes...</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button className="btn-secondary" onClick={handleReset} disabled={loading}>
              🔄 Réinitialiser
            </button>
          </div>
        </div>

        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>👤 Statut Détection</h3>
            {loading && <div className="spinner-small"></div>}
          </div>

          {message.text && (
            <div className={`message-banner ${message.type}`}>
              <div className="message-icon">{message.type === 'success' ? '✅' : '⚠️'}</div>
              <div className="message-text">{message.text}</div>
            </div>
          )}

          {employe ? (
            <div className="employe-card-active animate-slide-in">
              <div className="employe-profile-header">
                <div className="employe-avatar-large">
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div className="employe-meta">
                  <h2 className="employe-name">{employe.prenom} {employe.nom}</h2>
                  <p className="employe-id">{employe.matricule}</p>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Service</label>
                  <span>{employe.service?.nom_service || 'Non assigné'}</span>
                </div>
                <div className="info-item">
                  <label>Poste</label>
                  <span>{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && (
                <div className="action-buttons-grid">
                  <button
                    className="btn-action entree"
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    <span className="icon">📥</span> Pointer Entrée
                  </button>
                  <button
                    className="btn-action sortie"
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    <span className="icon">📤</span> Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div className="auto-mode-feedback">
                  <div className="pulse-icon">⚡</div>
                  <p>Mode automatique actif. Traitement en cours...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="scanner-placeholder">
              <div className="placeholder-icon">🔲</div>
              <p>{scanResult ? 'Recherche de l\'employé...' : 'Positionnez le QR code devant la caméra'}</p>
              {!isAutoMode && <span className="helper-text">Les boutons de pointage apparaîtront après détection.</span>}
              {isAutoMode && <span className="helper-text">Le pointage sera détecté et validé automatiquement.</span>}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .mode-toggle-container {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card);
          padding: 8px 16px;
          border-radius: 30px;
          border: 1px solid var(--border);
        }
        .mode-label {
          font-size: 13px;
          font-weight: 600;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .mode-label.active {
          opacity: 1;
          color: var(--primary);
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

        .scanner-viewport-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
        }
        .cooldown-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          color: white;
          text-align: center;
          padding: 20px;
        }
        .cooldown-badge {
          background: var(--warning);
          color: black;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .message-banner {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          border-left: 4px solid;
          animation: slideIn 0.3s ease;
        }
        .message-banner.success {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
          color: #15803d;
        }
        .message-banner.error {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          color: #b91c1c;
        }

        .employe-card-active {
          background: var(--primary-glow);
          border-radius: 15px;
          padding: 24px;
          border: 1px solid var(--primary-light);
        }
        .employe-profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }
        .employe-avatar-large {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
          box-shadow: 0 10px 20px var(--primary-glow);
        }
        .employe-name { margin: 0; font-size: 22px; }
        .employe-id { margin: 4px 0 0 0; color: var(--text-muted); font-family: monospace; font-size: 16px; }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 24px;
        }
        .info-item label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
        .info-item span { font-weight: 600; font-size: 15px; }

        .action-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .btn-action {
          padding: 14px;
          border-radius: 12px;
          border: none;
          color: white;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .btn-action.entree { background: #22c55e; }
        .btn-action.entree:hover { background: #16a34a; transform: translateY(-2px); }
        .btn-action.sortie { background: #f59e0b; }
        .btn-action.sortie:hover { background: #d97706; transform: translateY(-2px); }
        .btn-action:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .auto-mode-feedback {
          text-align: center;
          padding: 20px;
          color: var(--primary);
        }
        .pulse-icon {
          font-size: 40px;
          animation: pulse 1.5s infinite;
        }

        .scanner-placeholder {
          text-align: center;
          padding: 60px 20px;
          border: 2px dashed var(--border);
          border-radius: 15px;
          color: var(--text-muted);
        }
        .placeholder-icon { font-size: 48px; margin-bottom: 15px; opacity: 0.3; }
        .helper-text { display: block; margin-top: 10px; font-size: 12px; font-style: italic; }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default ScannerPage;
