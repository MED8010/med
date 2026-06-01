import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(() => {
    return localStorage.getItem('scanner_auto_mode') === 'true';
  });

  const scannerRef = useRef(null);
  const messageTimeoutRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);

  // We use refs to access current state in the stable onScanSuccess callback
  // without triggering scanner re-initialization
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
      const action = res.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${action === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (stateRef.current.isAutoMode) {
        // In auto mode, we stay on this page but enter cooldown
        setCooldown(true);
        setEmploye(emp);

        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldown(false);
          setEmploye(null);
          setScanResult(null);
        }, 3000);
      } else {
        // Manual mode: reset after delay
        messageTimeoutRef.current = setTimeout(() => {
          setEmploye(null);
          setScanResult(null);
          setMessage({ type: '', text: '' });
          startScanner();
        }, 3000);
      }

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (!stateRef.current.isAutoMode) {
          startScanner();
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
      const foundEmploye = res.data;
      setEmploye(foundEmploye);

      if (stateRef.current.isAutoMode) {
        // Trigger auto pointage
        await handlePointage('auto', foundEmploye);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlePointage]);

  // Sync callbacks to refs to avoid scanner restarts
  const onScanSuccessRef = useRef(null);
  onScanSuccessRef.current = (result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (!stateRef.current.isAutoMode && scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmploye(result);
  };

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((res) => onScanSuccessRef.current(res), (err) => {});
    scannerRef.current = scanner;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startScanner]);

  const toggleAutoMode = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    localStorage.setItem('scanner_auto_mode', newVal.toString());

    // Reset state when toggling
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);

    // Restart scanner to ensure it's in a clean state
    startScanner();
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    startScanner();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', padding: '8px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Mode Automatique</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={toggleAutoMode}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>📷 Scanner {isAutoMode && <span className="badge badge-primary">AUTO</span>}</h3>
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}></div>

          {cooldown && (
            <div className="scanner-cooldown-overlay">
              <div className="cooldown-spinner"></div>
              <p style={{ fontWeight: 700, fontSize: 18 }}>Traitement terminé</p>
              <p style={{ opacity: 0.8, fontSize: 13 }}>Prêt dans quelques secondes...</p>
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
          {loading && !cooldown && <div className="spinner" style={{ margin: '20px auto' }}></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
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
                  fontSize: 24, fontWeight: 800, border: '2px solid var(--primary)'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service || 'N/A'}</span>
              </div>
              <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', justifyContent: 'center' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    📥 Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', justifyContent: 'center' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    📤 Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                 <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-hover)', borderRadius: 8 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary)' }}>
                        Pointage Automatique Actif
                    </p>
                 </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📇</div>
              <p>{scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}</p>
              {isAutoMode && <p style={{ fontSize: 12, marginTop: 8 }}>Le système détectera automatiquement s'il s'agit d'une entrée ou d'une sortie.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
