import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const scannerRef = useRef(null);
  const isAutoModeRef = useRef(isAutoMode);
  const loadingRef = useRef(loading);
  const cooldownRef = useRef(cooldown);

  useEffect(() => {
    isAutoModeRef.current = isAutoMode;
  }, [isAutoMode]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    cooldownRef.current = cooldown;
  }, [cooldown]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
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
      handleAutoPointage(result);
    }
  };

  const handleAutoPointage = async (matricule) => {
    setLoading(true);
    setCooldown(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Get employee
      const empRes = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = empRes.data;
      setEmploye(empData);

      // 2. Perform auto pointage
      const pointagePayload = {
        employe_id: empData._id,
        scanner_action: 'auto'
      };

      const pRes = await apiClient.post('/pointages', pointagePayload);
      const { pointage } = pRes.data;

      const typeLabel = pointage.heure_sortie && !pointage.heure_entree ? 'sortie' : 'entrée';
      console.log(`Pointage auto: ${typeLabel}`);

      // If we just updated it, it depends on what the backend did.
      // Actually backend logic: if no entry -> set entry. if entry -> set exit.
      // So if it was 'auto' and it returned pointage:
      // if it has heure_sortie and it's the current time, it's a sortie.
      // But let's just use a generic message or trust the backend message if it was more specific.

      setMessage({
        type: 'success',
        text: `Pointage automatique réussi pour ${empData.prenom} ${empData.nom}`
      });

      // Clear after 3s and allow next scan
      setTimeout(() => {
        setEmploye(null);
        setMessage({ type: '', text: '' });
        setCooldown(false);
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur: Employé non trouvé ou problème de connexion' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        setCooldown(false);
      }, 3000);
    } finally {
      setLoading(false);
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
      // Restart scanner if not found
      startScanner();
    } finally {
      setLoading(false);
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

        <div className="section-card" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 15, margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Mode Automatique</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAutoMode}
                onChange={(e) => setIsAutoMode(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: isAutoMode ? 'var(--success)' : 'var(--text-muted)',
              boxShadow: isAutoMode ? '0 0 8px var(--success)' : 'none'
            }}></div>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {isAutoMode ? 'MAINS LIBRES' : 'MANUEL'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%' }}></div>

          {cooldown && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: 'white', textAlign: 'center', animation: 'fadeIn 0.3s ease'
            }}>
              <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', marginBottom: 15 }}></div>
              <p style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Traitement...</p>
              <p style={{ fontSize: 14, opacity: 0.8 }}>Veuillez patienter 3s</p>
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
          {loading && <div className="spinner"></div>}

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

              <div className="detail-item" style={{ marginBottom: 15 }}>
                <label>Service</label>
                <span>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24 }}>
                <label>Poste</label>
                <span>{employe.poste || 'Collaborateur'}</span>
              </div>

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
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              {scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
