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

  // References for states to avoid stale closures in callbacks
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
      const actionDone = res.data.effectiveAction || type;

      setMessage({
        type: 'success',
        text: `Pointage d'${actionDone === 'entree' ? 'entrée' : 'sortie'} enregistré pour ${emp.prenom} ${emp.nom}`
      });

      if (type === 'auto') {
        setCooldown(true);
        cooldownTimeoutRef.current = setTimeout(() => {
          setCooldown(false);
        }, 3000);
      }

      // Reset UI after success
      resetTimeoutRef.current = setTimeout(() => {
        if (!stateRef.current.isAutoMode) {
            setEmploye(null);
            setScanResult(null);
            // restartScannerRef.current(); // Call via ref to avoid circular dep
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {}).then(() => {
                    renderScanner();
                });
            }
        }
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du pointage' });
      if (type === 'auto') {
        setCooldown(true);
        setTimeout(() => setCooldown(false), 3000);
      }
    } finally {
      setLoading(false);
    }
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
        await handlePointage('auto', empData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Employé non trouvé ou erreur serveur' });
      setScanResult(null);
      if (!stateRef.current.isAutoMode) {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(() => {}).then(() => {
                renderScanner();
            });
        }
      } else {
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlePointage]);

  const onScanSuccess = useCallback((result) => {
    if (stateRef.current.loading || stateRef.current.cooldown) return;

    if (scannerRef.current && !stateRef.current.isAutoMode) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
    }

    setScanResult(result);
    loadEmploye(result);
  }, [loadEmploye]);

  const renderScanner = useCallback(() => {
    // Check if element exists before rendering
    if (!document.getElementById('reader')) return;

    const scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 250, height: 250 },
        fps: 10,
    });
    scanner.render(onScanSuccess, (err) => {});
    scannerRef.current = scanner;
  }, [onScanSuccess]);

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {}).then(() => {
            renderScanner();
        });
    } else {
        renderScanner();
    }
  }, [renderScanner]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [startScanner]);

  const handleReset = () => {
    setEmploye(null);
    setScanResult(null);
    setCooldown(false);
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
        <div className="d-flex align-center gap-12">
          <span className="fw-bold" style={{ fontSize: '13px' }}>Mode Automatique</span>
          <label className="toggle-switch">
            <input
                type="checkbox"
                checked={isAutoMode}
                onChange={() => {
                    setIsAutoMode(!isAutoMode);
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
            <div className="cooldown-overlay">
                <div className="cooldown-content">
                    <div className="spinner"></div>
                    <p>Traitement terminé...</p>
                    <small>Prêt dans 3 secondes</small>
                </div>
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

              <div className="detail-item" style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <label className="fw-bold">Service</label>
                <span>{employe.service?.nom_service || 'N/A'}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <label className="fw-bold">Poste</label>
                <span>{employe.poste || 'Collaborateur'}</span>
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
                <div style={{ textAlign: 'center', padding: '20px', background: 'var(--primary-glow)', borderRadius: '12px' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary)' }}>
                        Pointage automatique effectué
                    </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              {scanResult ? 'Recherche en cours...' : 'Veuillez scanner un badge QR code'}
              {isAutoMode && <p style={{ fontSize: '12px', marginTop: '10px' }}>(Le système détectera automatiquement s\'il s\'agit d\'une entrée ou d\'une sortie)</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
