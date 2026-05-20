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
  const stateRef = useRef({ loading, cooldown, isAutoMode, employe });
  const messageTimeoutRef = useRef(null);

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
      aspectRatio: 1.0
    });

    scanner.render(onScanSuccess, (err) => {});
    scannerRef.current = scanner;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Cleanup error", err));
      }
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, [startScanner]);

  const onScanSuccess = useCallback((result) => {
    const { loading, cooldown } = stateRef.current;
    if (loading || cooldown) return;

    setScanResult(result);
    loadEmploye(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEmploye = useCallback(async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (stateRef.current.isAutoMode) {
        handlePointage(empData, 'auto');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé' });
      setScanResult(null);
      triggerCooldown(2000);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointage = async (emp, type) => {
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);
      const actionLabel = res.data.effectiveAction === 'entree' ? 'ENTRÉE' : 'SORTIE';

      setMessage({
        type: 'success',
        text: `✅ ${actionLabel} validée : ${emp.prenom} ${emp.nom}`
      });

      triggerCooldown(3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du pointage' });
      triggerCooldown(2000);
    } finally {
      setLoading(false);
    }
  };

  const triggerCooldown = (ms) => {
    setCooldown(true);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    messageTimeoutRef.current = setTimeout(() => {
      setCooldown(false);
      setEmploye(null);
      setScanResult(null);
      setMessage({ type: '', text: '' });
    }, ms);
  };

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
    handleReset();
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
    setMessage({ type: '', text: '' });
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Pointeuse Digitale</h1>
          <p className="page-subtitle">Scanner de badge haute performance</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', padding: '10px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Mode Automatique</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={isAutoMode} onChange={toggleAutoMode} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>📷 Caméra</h3>
            {cooldown && <span className="badge badge-warning animate-pulse">Cooldown actif</span>}
          </div>

          <div style={{ padding: 20 }}>
            <div id="reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: 'none' }}></div>
          </div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-spinner"></div>
              <p style={{ fontWeight: 700, letterSpacing: 1 }}>TRAITEMENT...</p>
            </div>
          )}
        </div>

        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>👤 Statut</h3>
            {scanResult && <button className="btn-secondary" onClick={handleReset} style={{ padding: '4px 10px', fontSize: 11 }}>Annuler</button>}
          </div>

          {loading && !employe && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
              <p color="var(--text-secondary)">Identification...</p>
            </div>
          )}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'} animate-slide-in`} style={{ marginBottom: 20 }}>
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: 15, background: 'var(--primary-glow)', borderRadius: 12 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, border: '3px solid #fff'
                }}>
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18 }}>{employe.prenom} {employe.nom}</h2>
                  <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, fontSize: 12 }}>{employe.matricule}</p>
                </div>
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: 10, marginBottom: 24 }}>
                <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: 12 }}>Service</label>
                  <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
                </div>
                <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: 12 }}>Poste</label>
                  <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
                </div>
              </div>

              {!isAutoMode && !cooldown && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', justifyContent: 'center' }}
                    onClick={() => handlePointage(employe, 'entree')}
                    disabled={loading}
                  >
                    📥 ENTRÉE
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)', justifyContent: 'center' }}
                    onClick={() => handlePointage(employe, 'sortie')}
                    disabled={loading}
                  >
                    📤 SORTIE
                  </button>
                </div>
              )}
            </div>
          ) : !loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 16 }}>
              <div style={{ fontSize: 40, marginBottom: 15 }}>🪪</div>
              <p style={{ fontWeight: 500 }}>Prêt pour scan</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>Approchez un QR code de la caméra</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
