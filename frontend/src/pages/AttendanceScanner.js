import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const AttendanceScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [employe, setEmploye] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render((result) => {
            setScanResult(result);
            handleAttendance(result);
            scanner.pause(true); // Pause instead of clear to allow easy resume
        }, (err) => {
            // console.warn(err);
        });

        return () => {
            try {
                scanner.clear();
            } catch (e) {
                console.error("Error clearing scanner", e);
            }
        };
    }, []);

    const handleAttendance = async (matricule) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            // 1. Find employee by matricule
            const empRes = await apiClient.get(`/employes/matricule/${matricule}`);
            const emp = empRes.data;
            setEmploye(emp);

            // 2. Determine if entry or exit
            // For simplicity, we'll check if a pointage already exists for today
            const today = new Date().toISOString().split('T')[0];
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

            const pointagesRes = await apiClient.get(`/pointages/employe/${emp._id}?startDate=${today}&endDate=${today}`);
            const todayPointage = pointagesRes.data.find(p => p.date.startsWith(today));

            let payload = {
                employe_id: emp._id,
                date: today,
            };

            if (!todayPointage) {
                // First scan of the day: Entry
                payload.heure_entree = currentTime;
                payload.absence = false;
                await apiClient.post('/pointages', payload);
                setMessage({ type: 'success', text: `Entrée enregistrée pour ${emp.prenom} ${emp.nom} à ${currentTime}` });
            } else if (!todayPointage.heure_sortie) {
                // Second scan of the day: Exit
                payload.heure_sortie = currentTime;
                await apiClient.post('/pointages', payload);
                setMessage({ type: 'success', text: `Sortie enregistrée pour ${emp.prenom} ${emp.nom} à ${currentTime}` });
            } else {
                // Already has entry and exit
                setMessage({ type: 'info', text: `${emp.prenom} ${emp.nom} a déjà enregistré son entrée (${todayPointage.heure_entree}) et sa sortie (${todayPointage.heure_sortie}) aujourd'hui.` });
            }
        } catch (error) {
            console.error('Erreur scan:', error);
            setMessage({ type: 'danger', text: error.response?.data?.message || "Erreur lors de l'enregistrement du pointage" });
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setEmploye(null);
        setMessage({ type: '', text: '' });
        // The scanner is already rendered, we might need to resume it if paused
        // But html5-qrcode's scanner.render doesn't easily expose the instance
        // to resume here without extra complexity.
        // For a better UX without reload, we could use the Html5Qrcode class instead of Html5QrcodeScanner
        window.location.reload(); // Keeping it for now as it's the most reliable way with Html5QrcodeScanner
    };

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <div className="page-title-group">
                    <h1>Scanner de Pointage</h1>
                    <p className="page-subtitle">Utilisez la caméra pour scanner le QR Code de l'employé</p>
                </div>
                <button className="btn-primary" onClick={resetScanner}>🔄 Nouveau Scan</button>
            </div>

            <div className="grid-2">
                <div className="section-card">
                    <h3>📷 Caméra</h3>
                    <div id="reader" style={{ width: '100%', minHeight: '300px' }}></div>
                </div>

                <div className="section-card">
                    <h3>📄 Résultat du Scan</h3>
                    {loading && <div className="loading"><div className="spinner"></div>Traitement...</div>}

                    {message.text && (
                        <div className={`alert alert-${message.type}`} style={{
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            background: message.type === 'success' ? 'var(--success-bg)' : message.type === 'danger' ? 'var(--danger-bg)' : 'var(--primary-glow)',
                            color: message.type === 'success' ? 'var(--success)' : message.type === 'danger' ? 'var(--danger)' : 'var(--primary)',
                            border: `1px solid ${message.type === 'success' ? 'var(--success)' : message.type === 'danger' ? 'var(--danger)' : 'var(--primary)'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    {employe && (
                        <div className="profile-summary" style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '50%',
                                    background: 'var(--primary)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '24px', fontWeight: 'bold'
                                }}>
                                    {employe.prenom[0]}{employe.nom[0]}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{employe.prenom} {employe.nom}</h4>
                                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{employe.matricule}</p>
                                    <p style={{ margin: 0, fontSize: '13px' }}>{employe.service?.nom_service}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!scanResult && !loading && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔲</div>
                            <p>En attente d'un scan...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceScanner;
