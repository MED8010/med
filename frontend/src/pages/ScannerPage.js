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

  // Refs to store latest state/functions for access inside the stable onScanSuccess callback
  const stateRef = useRef({
    loading,
    cooldown,
    isAutoMode,
    employe
  });

  // Keep stateRef up to date
  useEffect(() => {
    stateRef.current = { loading, cooldown, isAutoMode, employe };
  }, [loading, cooldown, isAutoMode, employe]);

  const handlePointage = useCallback(async (type, targetEmploye) => {
    const emp = targetEmploye || stateRef.current.employe;
    if (!emp || stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    try {
      const payload = {
        employe_id: emp._id,
        scanner_action: type,
        absence: false
      };

      const response = await apiClient.post('/pointages', payload);
      const actionType = response.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionType === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      setCooldown(true);

      resetTimeoutRef.current = setTimeout(() => {
        setEmploye(null);
        setScanResult(null);
        setMessage({ type: '', text: '' });
        setCooldown(false);
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
    } finally {
      setLoading(false);
    }
  }, []); // Stable handlePointage

  const loadEmploye = useCallback(async (matricule) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/employes/matricule/${matricule}`);
      const empData = res.data;
      setEmploye(empData);

      if (stateRef.current.isAutoMode) {
        await handlePointage('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  }, [handlePointage]); // Depends only on stable handlePointage

  // This callback MUST be stable to avoid re-initializing the scanner
  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]); // Depends on stable loadEmploye

  const onScanError = useCallback((err) => {
    // console.warn(err);
  }, []);

  // Scanner initialization - ONLY ONCE ON MOUNT
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
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
    };
  }, []); // NO DEPENDENCIES -> NEVER RE-INITIALIZES

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setMessage({ type: '', text: '' });
    setCooldown(false);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Scanner QR Code</h1>
          <p className="page-subtitle">Pointeuse Digitale Haute Précision</p>
        </div>

        <div className="mode-toggle">
          <span className="mode-toggle-label">Mode Automatique</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAutoMode}
              onChange={(e) => setIsAutoMode(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card scanner-section">
          <h3>📷 Scanner</h3>
          <div id="reader" style={{ width: '100%', border: 'none' }}></div>

          {cooldown && (
            <div className="cooldown-overlay">
              <div className="success-icon">✅</div>
              <div className="cooldown-title">POINTAGE RÉUSSI</div>
              <div className="cooldown-subtitle">Prêt dans 3 secondes...</div>
            </div>
          )}

          {scanResult && !isAutoMode && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Relancer le scanner
              </button>
            </div>
          )}
        </div>

        <div className="section-card info-section">
          <h3>👤 Informations Employé</h3>
          {loading && <div className="spinner"></div>}

          {message.text && (
            <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
              {message.text}
            </div>
          )}

          {employe ? (
            <div className="animate-slide-in">
              <div className="employe-profile-header">
                <div className="employe-avatar">
                  {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div>
                  <h2 className="employe-name">{employe.prenom} {employe.nom}</h2>
                  <p className="employe-matricule">{employe.matricule}</p>
                </div>
              </div>

              <div className="detail-item-row">
                <label>Service</label>
                <span>{employe.service?.nom_service}</span>
              </div>
              <div className="detail-item-row">
                <label>Poste</label>
                <span>{employe.poste || 'Collaborateur'}</span>
              </div>

              {!isAutoMode && !cooldown && (
                <div className="pointage-actions">
                  <button
                    className="btn-primary btn-entree"
                    onClick={() => handlePointage('entree')}
                    disabled={loading}
                  >
                    📥 Pointer Entrée
                  </button>
                  <button
                    className="btn-primary btn-sortie"
                    onClick={() => handlePointage('sortie')}
                    disabled={loading}
                  >
                    📤 Pointer Sortie
                  </button>
                </div>
              )}

              {isAutoMode && (
                <div className="auto-mode-info">
                  <span>
                    Mode Auto : Traitement automatique basé sur l'historique du jour.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-info-state">
              {scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
