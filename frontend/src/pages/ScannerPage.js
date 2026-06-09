import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
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

  // Refs to access latest state in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handleReset = useCallback(() => {
    setEmploye(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
  }, []);

  const handlePointage = useCallback(async (matriculeOrId, type = 'auto', isManual = false) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    try {
      // First, find the employee if we only have a matricule (from QR)
      let targetEmploye = stateRef.current.employe;
      if (!targetEmploye || isManual) {
        const res = await apiClient.get(`/employes/matricule/${matriculeOrId}`);
        targetEmploye = res.data;
        setEmploye(targetEmploye);
      }

      const payload = {
        employe_id: targetEmploye._id,
        scanner_action: type,
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const { pointage } = response.data;
      const actionLabel = pointage.effectiveAction === 'entree' ? 'ENTRÉE' : 'SORTIE';

      setMessage({
        type: 'success',
        text: `✅ ${actionLabel} validée pour ${targetEmploye.prenom} ${targetEmploye.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setMessage({ type: '', text: '' });
        }, 5000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Erreur: Employé non identifié ou problème réseau' });
      messageTimerRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setLoading(false);
    }
  }, []);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (stateRef.current.isAutoMode) {
      handlePointage(result, 'auto');
    } else {
      // In manual mode, just load the employee
      loadEmploye(result);
    }
  }, [handlePointage]);

  const loadEmploye = async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, (err) => {});
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
      }
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [onScanSuccess]);

  const toggleAutoMode = () => {
    const newValue = !isAutoMode;
    setIsAutoMode(newValue);
    localStorage.setItem('scanner_auto_mode', newValue.toString());
    handleReset();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Pointeuse Digitale</h1>
          <p className="page-subtitle">Scanner de badges QR Haute Précision</p>
        </div>
        <div className="mode-toggle-container">
          <span className={`mode-label ${!isAutoMode ? 'active' : ''}`}>Manuel</span>
          <label className="switch">
            <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
            <span className="slider round"></span>
          </label>
          <span className={`mode-label ${isAutoMode ? 'active' : ''}`}>Automatique</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card scanner-section">
          <div className="card-header">
            <h3>📷 Scanner de Badge</h3>
            {cooldown && <span className="cooldown-badge">Attente...</span>}
          </div>
          <div className="scanner-wrapper">
            <div id="reader" style={{ width: '100%' }}></div>
            {cooldown && (
              <div className="scanner-overlay cooldown">
                <div className="spinner-glow"></div>
                <p>Prêt dans quelques secondes...</p>
              </div>
            )}
          </div>
        </div>

        <div className="section-card info-section">
          <h3>👤 Informations</h3>
          {loading && <div className="loading-bar-container"><div className="loading-bar"></div></div>}

          {message.text && (
            <div className={`status-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="employe-profile-card">
              <div className="avatar-large">
                {employe.prenom[0]}{employe.nom[0]}
              </div>
              <div className="employe-info">
                <h2>{employe.prenom} {employe.nom}</h2>
                <p className="matricule">{employe.matricule}</p>
                <div className="info-tags">
                  <span className="tag service">{employe.service?.nom_service}</span>
                  <span className="tag poste">{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && (
                <div className="action-buttons">
                  <button
                    className="btn-entree"
                    onClick={() => handlePointage(employe.matricule, 'entree', true)}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-sortie"
                    onClick={() => handlePointage(employe.matricule, 'sortie', true)}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                  <button className="btn-reset" onClick={handleReset}>Annuler</button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📇</div>
              <p>Positionnez le QR code du badge face à la caméra</p>
              {isAutoMode && <span className="auto-hint">Le pointage sera validé automatiquement</span>}
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
          border-radius: 50px;
          border: 1px solid var(--border);
        }

        .mode-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .mode-label.active {
          color: var(--primary);
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
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
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(20px); }

        .scanner-wrapper {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .scanner-overlay.cooldown {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          backdrop-filter: blur(4px);
          color: white;
        }

        .spinner-glow {
          width: 40px;
          height: 40px;
          border: 3px solid transparent;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 15px var(--primary);
          margin-bottom: 15px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .status-message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 600;
          animation: fadeIn 0.3s ease;
        }

        .status-message.success { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
        .status-message.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

        .employe-profile-card {
          text-align: center;
          padding: 20px;
          animation: slideUp 0.4s ease;
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          background: var(--primary-glow);
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          margin: 0 auto 20px;
          border: 3px solid var(--bg-body);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }

        .matricule { color: var(--text-muted); font-family: monospace; font-size: 1.1rem; margin-top: -10px; }

        .info-tags { display: flex; gap: 8px; justify-content: center; margin: 15px 0; }
        .tag { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .tag.service { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        .tag.poste { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); }

        .action-buttons { display: grid; gap: 10px; margin-top: 30px; }
        .btn-entree { background: #22c55e; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .btn-sortie { background: #f59e0b; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .btn-reset { background: transparent; color: var(--text-muted); border: 1px solid var(--border); padding: 10px; border-radius: 8px; cursor: pointer; }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
        }

        .empty-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.2; }
        .auto-hint { display: block; margin-top: 10px; font-size: 0.8rem; color: var(--primary); font-weight: 600; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default ScannerPage;
