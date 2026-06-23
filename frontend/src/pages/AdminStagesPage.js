import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const AdminStagesPage = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('en_attente');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [motifRefus, setMotifRefus] = useState('');

  useEffect(() => {
    loadAllStages();
  }, []);

  const loadAllStages = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/stages');
      setStages(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiClient.put(`/stages/${id}/approve`);
      setSuccess('Demande approuvée avec succès');
      loadAllStages();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/stages/${rejectingId}/reject`, { motif_refus: motifRefus });
      setSuccess('Demande refusée');
      setRejectingId(null);
      setMotifRefus('');
      loadAllStages();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors du refus');
    }
  };

  const filteredStages = filter === 'all'
    ? stages
    : stages.filter(s => s.statut === filter);

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Gestion des Stages</h1>
          <p className="page-subtitle">Administration et validation des projets de stage</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="filter-bar-card section-card">
        <div className="filter-container">
          <div className="filter-group">
            <label>Statut</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="en_attente">En attente</option>
              <option value="approuve">Approuvé</option>
              <option value="refuse">Refusé</option>
              <option value="all">Tous</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Titre / Entreprise</th>
                <th>Domaine</th>
                <th>Période</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>
                    Aucune demande de stage trouvée
                  </td>
                </tr>
              ) : (
                filteredStages.map(stage => (
                  <tr key={stage._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{stage.employe?.prenom} {stage.employe?.nom}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stage.employe?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{stage.titre}</div>
                      <div style={{ fontSize: 12 }}>{stage.entreprise}</div>
                    </td>
                    <td><span className="badge badge-info">{stage.domaine}</span></td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        {new Date(stage.date_debut).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: 12 }}>
                        {new Date(stage.date_fin).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${
                        stage.statut === 'approuve' ? 'success' :
                        stage.statut === 'refuse' ? 'danger' : 'warning'
                      }`}>
                        {stage.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {stage.statut === 'en_attente' ? (
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleApprove(stage._id)}
                            title="Approuver"
                          >
                            ✅
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => setRejectingId(stage._id)}
                            title="Refuser"
                          >
                            ❌
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Traitée par {stage.approuve_par?.email || 'Système'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejectingId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Refuser la demande</h3>
              <button className="modal-close" onClick={() => setRejectingId(null)}>×</button>
            </div>
            <form onSubmit={handleReject}>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Motif du refus</label>
                <textarea
                  value={motifRefus}
                  onChange={(e) => setMotifRefus(e.target.value)}
                  placeholder="Expliquez pourquoi la demande est refusée..."
                  required
                  rows="4"
                  style={{ width: '100%', marginTop: 8 }}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setRejectingId(null)}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ background: 'var(--danger)' }}>Confirmer le Refus</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStagesPage;
