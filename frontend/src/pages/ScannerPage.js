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
    const saved = localStorage.getItem('scanner_auto_mode');
    return saved === 'true';
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const scannerRef = useRef(null);
  const messageTimeoutRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);

  // Stability refs to prevent closure issues in callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const onScanSuccessRef = useRef();
  const loadEmployeRef = useRef();
  const handlePointageRef = useRef();

  const handlePointage = useCallback(async (type, targetEmploye = null) => {
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
      const actionLabel = res.data.pointage.effectiveAction === 'entree' ? 'ENTRÉE' : 'SORTIE';

      setMessage({
        type: 'success',
        text: `Pointage ${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (stateRef.current.isAutoMode) {
        setCooldown(true);
        if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldown(false);
          setScanResult(null);
          setEmploye(null);
        }, 3000);
      } else {
        // Manual mode reset
        setTimeout(() => {
          handleReset();
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      // If Auto Mode is on, trigger pointage automatically
      if (stateRef.current.isAutoMode) {
        handlePointageRef.current('auto', res.data);
      } else {
        // Manual mode: stop scanner to focus on UI
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé' });
      setScanResult(null);
      setLoading(false);

      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      if (!stateRef.current.isAutoMode) setLoading(false);
    }
  }, []);

  const onScanSuccess = useCallback((result) => {
    const { loading, cooldown } = stateRef.current;
    if (loading || cooldown) return;

    setScanResult(result);
    loadEmployeRef.current(result);
  }, []);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    loadEmployeRef.current = loadEmploye;
    handlePointageRef.current = handlePointage;
  });

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((result) => onScanSuccessRef.current(result), onScanError);
    scannerRef.current = scanner;
  }, []);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
    };
  }, [startScanner]);

  const onScanError = (err) => {
    // console.warn(err);
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    startScanner();
  };

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());
    if (newVal && scannerRef.current === null) {
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
        <div className="page-actions">
           <label className="toggle-switch">
             <input
               type="checkbox"
               checked={isAutoMode}
               onChange={toggleAutoMode}
             />
             <span className="slider"></span>
             <span className="toggle-label">Mode Mains-Libres (Auto)</span>
           </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-spinner"></div>
              <p>Patientez...</p>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3>👤 Informations</h3>
            {isAutoMode && <span className="badge badge-success">AUTO ACTIVE</span>}
          </div>

          {loading && <div className="spinner-container"><div className="spinner"></div></div>}

          {message.text && (
            <div className={`message-banner ${message.type}`}>
              {message.type === 'success' ? '✅' : '❌'} {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-fade-in">
              <div className="scanner-profile-card">
                <div className="scanner-avatar">
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div className="scanner-info">
                  <h2>{employe.prenom} {employe.nom}</h2>
                  <p className="matricule">{employe.matricule}</p>
                  <div className="tags">
                    <span className="tag">{employe.service?.nom_service}</span>
                    <span className="tag">{employe.poste || 'Collaborateur'}</span>
                  </div>
                </div>
              </div>

              {!isAutoMode && (
                <div className="pointage-actions">
                  <button
                    className="btn-pointage entree"
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    <span className="icon">📥</span>
                    <span className="label">Entrée</span>
                  </button>
                  <button
                    className="btn-pointage sortie"
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    <span className="icon">📤</span>
                    <span className="label">Sortie</span>
                  </button>
                </div>
              )}

              {isAutoMode && !loading && (
                 <div className="auto-confirmation">
                    <div className="pulse-dot"></div>
                    Enregistrement automatique...
                 </div>
              )}
            </div>
          ) : (
            <div className="scanner-placeholder">
              <div className="placeholder-icon">🔲</div>
              <p>{scanResult ? 'Identification en cours...' : 'Présentez votre badge QR code devant la caméra'}</p>
              {isAutoMode && <p className="hint">Le système détectera et enregistrera votre passage automatiquement.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
