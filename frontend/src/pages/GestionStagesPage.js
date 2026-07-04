import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const GestionStagesPage = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('en_attente');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [motifRefus, setMotifRefus] = useState('');

  useEffect(() => {
    loadStages();
  }, []);

  const loadStages = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/stages');
      setStages(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du chargement des demandes' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approuver cette demande de stage ?')) return;
    try {
      await apiClient.put(`/stages/${id}/approve`);
      setMessage({ type: 'success', text: 'Demande approuvée avec succès' });
      loadStages();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'approbation' });
    }
  };

  const openRejectModal = (stage) => {
    setSelectedStage(stage);
    setMotifRefus('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!motifRefus.trim()) return alert('Veuillez saisir un motif');
    try {
      await apiClient.put(`/stages/${selectedStage._id}/reject`, { motif_refus: motifRefus });
      setMessage({ type: 'success', text: 'Demande refusée' });
      setShowRejectModal(false);
      loadStages();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du refus' });
    }
  };

  const filteredStages = filter === 'all' ? stages : stages.filter(s => s.statut === filter);

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Gestion des Stages</h1>
          <p className="page-subtitle">Administration des demandes de stage et alternance</p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: 20 }}>
          {message.text}
        </div>
      )}

      <div className="section-card">
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {['all', 'en_attente', 'approuve', 'refuse'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn-secondary ${filter === f ? 'active' : ''}`}
              style={{
                background: filter === f ? 'var(--primary)' : 'var(--bg-hover)',
                color: filter === f ? 'white' : 'var(--text-primary)',
                borderColor: filter === f ? 'var(--primary)' : 'var(--border)'
              }}
            >
              {f === 'all' ? 'Tous' : f === 'en_attente' ? 'En attente' : f === 'approuve' ? 'Approuvés' : 'Refusés'}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner"></div> : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employé</th>
                  <th>Titre & Entreprise</th>
                  <th>Dates</th>
                  <th>Domaine</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStages.map(stage => (
                  <tr key={stage._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{stage.employe?.prenom} {stage.employe?.nom}</div>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{stage.employe?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{stage.titre}</div>
                      <div style={{ fontSize: 12 }}>🏢 {stage.entreprise}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>
                        Du {new Date(stage.date_debut).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: 13 }}>
                        Au {new Date(stage.date_fin).toLocaleDateString()}
                      </div>
                    </td>
                    <td><span className="badge badge-info">{stage.domaine}</span></td>
                    <td>
                      <span className={`badge ${
                        stage.statut === 'approuve' ? 'badge-success' :
                        stage.statut === 'refuse' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {stage.statut}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {stage.statut === 'en_attente' && (
                          <>
                            <button
                              className="btn-action"
                              title="Approuver"
                              onClick={() => handleApprove(stage._id)}
                              style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}
                            >
                              ✅
                            </button>
                            <button
                              className="btn-action"
                              title="Refuser"
                              onClick={() => openRejectModal(stage)}
                              style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}
                            >
                              ❌
                            </button>
                          </>
                        )}
                        <button
                          className="btn-action"
                          title="Détails"
                          onClick={() => alert(stage.description)}
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStages.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      Aucune demande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content section-card" style={{ maxWidth: 400 }}>
            <h3>Refuser la demande</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Veuillez saisir le motif du refus pour {selectedStage?.employe?.prenom}.
            </p>
            <textarea
              value={motifRefus}
              onChange={(e) => setMotifRefus(e.target.value)}
              placeholder="Ex: Période non compatible avec le planning service..."
              rows="4"
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowRejectModal(false)}>Annuler</button>
              <button className="btn-primary" style={{ background: 'var(--danger)' }} onClick={handleReject}>Confirmer Refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionStagesPage;
