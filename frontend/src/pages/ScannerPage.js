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

  // Use a ref to keep track of state for the stable onScanSuccess callback
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

      // If auto mode is enabled, proceed with automatic pointage
      if (stateRef.current.isAutoMode) {
        await handlePointage('auto', res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      setEmploye(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const onScanSuccess = useCallback((result) => {
    // Prevent scan if loading, cooldown active, or if same result is already being processed
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const onScanError = (err) => {
    // Silently ignore scan errors (they happen every frame)
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [onScanSuccess]);

  const handlePointage = async (type, targetEmploye) => {
    const emp = targetEmploye || employe;
    if (!emp) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const res = await apiClient.post('/pointages', payload);

      const actionLabel = res.data.effectiveAction === 'entree' ? 'entrée' : 'sortie';
      setMessage({
        type: 'success',
        text: `Pointage d'${actionLabel} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      // Activate cooldown to prevent duplicate scans
      setCooldown(true);
      cooldownTimeoutRef.current = setTimeout(() => {
        setCooldown(false);
      }, 3000);

      // Auto-reset UI after a delay
      resetTimeoutRef.current = setTimeout(() => {
        if (!stateRef.current.cooldown) {
           setEmploye(null);
           setScanResult(null);
           setMessage({ type: '', text: '' });
        }
      }, 5000);

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
    setCooldown(false);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Mode Automatique</span>
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
        <div className="section-card" style={{ position: 'relative' }}>
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%', overflow: 'hidden', borderRadius: 12 }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="cooldown-spinner"></div>
              <p style={{ fontWeight: 700 }}>Scan réussi !</p>
              <p style={{ fontSize: 12, opacity: 0.8 }}>Patientez un instant...</p>
            </div>
          )}

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button className="btn-secondary" onClick={handleReset}>
              🔄 Réinitialiser
            </button>
          </div>
        </div>

        <div className="section-card">
          <h3>👤 Statut du Pointage</h3>

          {loading && !employe && (
            <div className="loading" style={{ minHeight: 200 }}>
              <div className="spinner"></div>
              <p>Recherche...</p>
            </div>
          )}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
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

              {!isAutoMode && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handlePointage('entree')}
                    disabled={loading || cooldown}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                    onClick={() => handlePointage('sortie')}
                    disabled={loading || cooldown}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                 <div style={{
                   padding: 20,
                   background: 'var(--bg-hover)',
                   borderRadius: 12,
                   textAlign: 'center',
                   border: '1px dashed var(--primary)'
                 }}>
                   <span style={{ fontSize: 24 }}>⚡</span>
                   <p style={{ fontWeight: 600, margin: '8px 0 0' }}>Pointage Automatique Actif</p>
                   <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Le système détecte l'action appropriée</p>
                 </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🪪</div>
              <p>Veuillez présenter un badge QR code devant la caméra</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
