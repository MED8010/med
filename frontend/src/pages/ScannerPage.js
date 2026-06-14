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
  const [cooldown, setCooldown] = useState(false);

  const scannerRef = useRef(null);
  const cooldownRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  // Create refs to access current state in stable callbacks
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp || stateRef.current.loading) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionType = res.data.pointage?.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionType === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Clear previous message timeout
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

      messageTimeoutRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        if (!stateRef.current.isAutoMode) {
          startScanner();
        }
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, [startScanner]);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (stateRef.current.isAutoMode) {
        handlePointage('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode) {
        startScanner();
      }
    } finally {
      setLoading(false);
    }
  }, [handlePointage, startScanner]);

  // Use refs for callbacks passed to scanner to avoid re-renders restarting scanner
  const onScanSuccessRef = useRef();
  const loadEmployeRef = useRef();
  const handlePointageRef = useRef();

  onScanSuccessRef.current = (result) => {
    if (stateRef.current.cooldown || stateRef.current.loading) return;

    // Set cooldown
    setCooldown(true);
    if (cooldownRef.current) clearTimeout(cooldownRef.current);
    cooldownRef.current = setTimeout(() => setCooldown(false), 5000);

    if (!stateRef.current.isAutoMode && scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmployeRef.current(result);
  };

  loadEmployeRef.current = loadEmploye;
  handlePointageRef.current = handlePointage;

  const onScanError = (err) => {
    // console.warn(err);
  };

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((res) => onScanSuccessRef.current(res), onScanError);
    scannerRef.current = scanner;
  }, []);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, [startScanner]);

  const toggleAutoMode = () => {
    const next = !isAutoMode;
    setIsAutoMode(next);
    localStorage.setItem('scanner_auto_mode', next.toString());

    // If turning off auto mode while an employee is shown, we might need to restart scanner
    if (!next && !employe && !loading) {
      startScanner();
    }
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
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

        <div className="action-buttons">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Mode Auto</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <h3>📷 Scanner</h3>

          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="spinner"></div>
              <p>Patientez quelques secondes...</p>
            </div>
          )}

          {scanResult && !isAutoMode && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}

          {isAutoMode && (
            <div style={{ marginTop: 20, padding: 15, background: 'var(--primary-glow)', borderRadius: 10, border: '1px dashed var(--primary)', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
                ✨ Mode Automatique Activé
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: 11, opacity: 0.7 }}>
                Les pointages sont détectés automatiquement
              </p>
            </div>
          )}
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 24 }}>
              {message.type === 'success' ? '✅' : '⚠️'} {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '20px',
                  background: 'var(--grad-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, fontWeight: 800, boxShadow: 'var(--shadow-primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 4, color: 'var(--primary)', fontWeight: 700 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 24 }}>
                <div className="detail-item" style={{ background: 'var(--bg-hover)', padding: 12, borderRadius: 10 }}>
                  <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Service</label>
                  <span style={{ fontWeight: 600 }}>{employe.service?.nom_service || 'N/A'}</span>
                </div>
                <div className="detail-item" style={{ background: 'var(--bg-hover)', padding: 12, borderRadius: 10 }}>
                  <label style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Poste</label>
                  <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-success)', border: 'none', height: 50 }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--grad-warning)', border: 'none', height: 50 }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div style={{ padding: '20px', textAlign: 'center', background: 'var(--success-bg)', borderRadius: 12, border: '1px solid var(--success)' }}>
                  <p style={{ color: 'var(--success)', fontWeight: 700, margin: 0 }}>
                    Traitement automatique terminé
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.3 }}>🪪</div>
              <p>{scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code pour commencer'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
