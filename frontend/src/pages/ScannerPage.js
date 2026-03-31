import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const scannerRef = useRef(null);
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const cooldownRef = useRef(cooldown);

  // Sync refs with state
  useEffect(() => { isAutoModeRef.current = isAutoMode; }, [isAutoMode]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { cooldownRef.current = cooldown; }, [cooldown]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, []);

  const startScanner = () => {
    // If there's an existing scanner, try to clear it first
    if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  };

  const onScanSuccess = (result) => {
    if (loadingRef.current || cooldownRef.current) return;

    if (!isAutoModeRef.current) {
      if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      setScanResult(result);
      loadEmploye(result);
    } else {
      processAutoPointage(result);
    }
  };

  const onScanError = (err) => {
    // console.warn(err);
  };

  const loadEmploye = async (matricule) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      setEmploye(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!isAutoModeRef.current) startScanner();
    } finally {
      setLoading(false);
    }
  };

  const processAutoPointage = async (matricule) => {
    setLoading(true);
    setCooldown(true);
    try {
      // 1. Get employee
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const emp = res.data;
      setEmploye(emp);

      // 2. Pointage auto
      const payload = {
        employe_id: emp._id,
        scanner_action: 'auto',
        absence: false
      };

      const pointageRes = await apiClient.post('/pointages', payload);
      const p = pointageRes.data.pointage;

      // Determine label based on backend response
      const actionType = p.heure_sortie ? 'sortie' : 'entrée';

      setMessage({
        type: 'success',
        text: `Pointage d'${actionType} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // 3. Reset after 3s
      setTimeout(() => {
        setEmploye(null);
        setMessage({ type: '', text: '' });
        setCooldown(false);
        setLoading(false);
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du scan automatique' });
      setTimeout(() => {
        setCooldown(false);
        setLoading(false);
        setMessage({ type: '', text: '' });
      }, 2000);
    }
  };

  const handlePointage = async (type) => {
    if (!employe) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: employe._id,
        scanner_action: type, // 'entree' or 'sortie'
        absence: false
      };

      await apiClient.post('/pointages', payload);
      setMessage({
        type: 'success',
        text: `Pointage d'${type === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${employe.prenom} ${employe.nom}`
      });

      // Reset after success
      setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        startScanner();
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    startScanner();
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Mode Automatique</span>
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
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div style={{
                position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.9)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'white', zIndex: 10, textAlign: 'center', padding: 20
            }}>
                <div style={{ fontSize: 60, marginBottom: 10 }}>✅</div>
                <h2 style={{ color: 'white', margin: 0 }}>Pointage Réussi</h2>
                <p>Scanner en pause (3s)...</p>
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
          {loading && !cooldown && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
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
                <label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Service</label>
                <span style={{ fontWeight: 600 }}>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Poste</label>
                <span style={{ fontWeight: 600 }}>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                    >
                    📥 Pointer Entrée
                    </button>
                    <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                    >
                    📤 Pointer Sortie
                    </button>
                </div>
              )}

              {isAutoMode && (
                <div style={{ textAlign: 'center', padding: '15px', background: 'var(--success-bg)', borderRadius: '8px', color: 'var(--success)', fontWeight: 600 }}>
                    ✨ Traitement Automatique Intelligent
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              {scanResult || (loading && !cooldown) ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
              {isAutoMode && <p style={{ fontSize: 12, marginTop: 10 }}>Mode automatique activé : présentez simplement le QR code</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
