import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [autoMode, setAutoMode] = useState(() => {
    const saved = localStorage.getItem('scanner_auto_mode');
    return saved === 'true';
  });

  const scannerRef = useRef(null);
  const cooldownRef = useRef(false);
  const loadingRef = useRef(false);
  const isAutoModeRef = useRef(autoMode);

  // Sync ref with state for use in stable callback
  useEffect(() => {
    isAutoModeRef.current = autoMode;
    localStorage.setItem('scanner_auto_mode', autoMode);
  }, [autoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const handlePointage = useCallback(async (emp, type) => {
    if (!emp || loadingRef.current) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type, // 'entree', 'sortie' or 'auto'
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionLabel = res.data.pointage?.effectiveAction === 'entree' ? 'entrée' : 'sortie';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Reset after success
      setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    if (loadingRef.current) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (isAutoModeRef.current) {
        await handlePointage(empData, 'auto');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } finally {
      setLoading(false);
    }
  }, [handlePointage]);

  // Use refs for callbacks passed to scanner to prevent re-renders restarting scanner
  const onScanSuccessRef = useRef(null);
  onScanSuccessRef.current = (result) => {
    if (cooldownRef.current || loadingRef.current) return;

    // Set cooldown
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 5000);

    setScanResult(result);
    loadEmploye(result);
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render((res) => onScanSuccessRef.current(res), (err) => {
      // ignore errors
    });

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, []); // Only run once on mount

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', padding: '8px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Mode Auto</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={() => setAutoMode(!autoMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>📷 Scanner</h3>
            {cooldownRef.current && <span style={{ fontSize: 12, color: 'var(--warning)' }}>⏳ Cooldown actif...</span>}
          </div>

          <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: 'none' }}></div>

          {(scanResult || employe) && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Prêt pour scan suivant
              </button>
            </div>
          )}

          <div style={{ marginTop: 20, padding: 15, background: 'rgba(99, 102, 241, 0.05)', borderRadius: 8, fontSize: 13 }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>💡 Conseils :</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Placez le QR code au centre du cadre</li>
              <li>Assurez-vous d'avoir un bon éclairage</li>
              <li>Le mode auto gère intelligemment l'entrée et la sortie</li>
            </ul>
          </div>
        </div>

        <div className="section-card">
          <h3>👤 Informations Employé</h3>

          <div style={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
            {loading && !employe && (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
              </div>
            )}

            {message.text && (
              <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
                {message.type === 'success' ? '✅' : '⚠️'} {message.text}
              </div>
            )}

            {employe ? (
              <div className="animate-slide-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: 20, background: 'var(--bg-body)', borderRadius: 12 }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'var(--primary-glow)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 800, border: '4px solid var(--bg-card)'
                  }}>
                    {employe.prenom[0]}{employe.nom[0]}
                  </div>
                  <div>
                    <h2 style={{ margin: '0 0 4px 0' }}>{employe.prenom} {employe.nom}</h2>
                    <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 600 }}>{employe.matricule}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: 14, color: 'var(--text-muted)' }}>{employe.poste || 'Collaborateur'}</p>
                  </div>
                </div>

                <div className="detail-item" style={{ marginBottom: 15 }}>
                  <label>Service</label>
                  <span>{employe.service?.nom_service || 'N/A'}</span>
                </div>
                <div className="detail-item" style={{ marginBottom: 30 }}>
                  <label>UAP</label>
                  <span>{employe.uap?.nom_uap || 'N/A'}</span>
                </div>

                {!autoMode && !loading && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <button
                      className="btn-primary"
                      style={{ background: 'var(--success)', borderColor: 'var(--success)', height: 50 }}
                      onClick={() => handlePointage(employe, 'entree')}
                      disabled={loading}
                    >
                      📥 Pointer Entrée
                    </button>
                    <button
                      className="btn-primary"
                      style={{ background: 'var(--warning)', borderColor: 'var(--warning)', height: 50 }}
                      onClick={() => handlePointage(employe, 'sortie')}
                      disabled={loading}
                    >
                      📤 Pointer Sortie
                    </button>
                  </div>
                )}

                {autoMode && loading && (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <div className="spinner" style={{ margin: '0 auto 10px' }}></div>
                    <p>Enregistrement automatique...</p>
                  </div>
                )}
              </div>
            ) : !loading && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔲</div>
                <p>{scanResult ? 'Recherche de l\'employé...' : 'Veuillez présenter un badge QR code devant la caméra'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
