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

  // Refs to keep track of latest state in callbacks without re-triggering useEffect
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);

      // If auto mode is on, trigger pointage automatically
      if (stateRef.current.isAutoMode) {
        handlePointage('auto', res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      // In auto mode, we don't need to restart scanner because it's already running
      // unless we stopped it. In this refactored version, we don't stop it.
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp || stateRef.current.cooldown) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie', or 'auto'
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const actionTaken = response.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionTaken === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Start cooldown to prevent double scans
      setCooldown(true);
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldown(false);
      }, 3000);

      // Reset info display after delay
      resetTimeoutRef.current = setTimeout(() => {
        if (!stateRef.current.cooldown) { // only reset if not in a middle of another scan
             setEmploye(null);
             setScanResult(null);
             setMessage({ type: '', text: '' });
        }
      }, 5000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);
    } finally {
      setLoading(false);
    }
  }, []);

  const onScanSuccess = useCallback((result) => {
    // Prevent scanning if loading or in cooldown
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    // If we already have the same result and it's recently scanned, skip
    if (result === scanResult && stateRef.current.employe) return;

    setScanResult(result);
    loadEmploye(result);
  }, [scanResult, loadEmploye]);

  // Use refs to keep callbacks stable for the scanner
  const onScanSuccessRef = useRef(onScanSuccess);
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    }, /* verbose= */ false);

    scanner.render((res) => onScanSuccessRef.current(res), (err) => {
        // silence errors
    });
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div className="d-flex align-center gap-12" style={{ background: 'var(--bg-card)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Mode Automatique</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={() => setIsAutoMode(!isAutoMode)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
             <h3>📷 Scanner en direct</h3>
             {isAutoMode && <span className="badge badge-primary">AUTO ACTIVE</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: 'none' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-spinner"></div>
              <p style={{ fontWeight: 700, letterSpacing: '1px' }}>TRAITEMENT RÉUSSI</p>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Pause de sécurité (3s)...</p>
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

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'} animate-slide-in`}>
              {message.type === 'success' ? '✅ ' : '❌ '}
              {message.text}
            </div>
          )}

          {loading && !employe && (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <div className="spinner"></div>
             </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: '15px', background: 'var(--bg-hover)', borderRadius: '12px' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--grad-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 800, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item" style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--border)' }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--border)' }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', justifyContent: 'center' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', justifyContent: 'center' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div style={{ textAlign: 'center', padding: '15px', background: 'var(--primary-glow)', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
                   <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 600 }}>Mode Automatique : Action déterminée par le système</p>
                </div>
              )}
            </div>
          ) : (
            !loading && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.3 }}>🪪</div>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>Veuillez présenter votre badge QR code devant la caméra</p>
                <p style={{ fontSize: '12px', marginTop: '10px' }}>Le pointage sera enregistré instantanément</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
