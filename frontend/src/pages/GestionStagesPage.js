import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const GestionStagesPage = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('tous');

  useEffect(() => {
    loadAllStages();
  }, []);

  const loadAllStages = async () => {
    try {
      const response = await apiClient.get('/stages');
      setStages(response.data);
    } catch (error) {
      console.error('Erreur chargement stages:', error);
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      let motif = '';
      if (action === 'reject') {
        motif = prompt('Motif du refus :');
        if (motif === null) return;
      }

      await apiClient.put(`/stages/${id}/${action}`, { motif_refus: motif });
      setSuccessMessage(`Demande ${action === 'approve' ? 'approuvée' : 'refusée'} avec succès`);
      loadAllStages();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(`Erreur lors de l'action : ${error.response?.data?.message || error.message}`);
    }
  };

  const filteredStages = stages.filter(s => {
    if (filter === 'tous') return true;
    if (filter === 'en_attente') return s.statut === 'en_attente';
    if (filter === 'approuve') return s.statut === 'approuve';
    if (filter === 'refuse') return s.statut === 'refuse';
    return true;
  });

  if (loading) return <div className="dashboard"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🎓 Gestion des Stages</h1>
          <p className="page-subtitle">Administration et validation des projets de stage</p>
        </div>

        <div className="header-actions">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            <option value="tous">Toutes les demandes</option>
            <option value="en_attente">En attente</option>
            <option value="approuve">Approuvées</option>
            <option value="refuse">Refusées</option>
          </select>
        </div>
      </div>

      {error && <div className="message error-message">{error}</div>}
      {successMessage && <div className="message success-message">{successMessage}</div>}

      <div className="section-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employé</th>
                <th>Projet</th>
                <th>Domaine</th>
                <th>Période</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStages.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    Aucune demande de stage trouvée
                  </td>
                </tr>
              ) : (
                filteredStages.map(stage => (
                  <tr key={stage._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                          {stage.employe?.prenom?.[0] || '?'}{stage.employe?.nom?.[0] || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{stage.employe?.prenom} {stage.employe?.nom}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stage.entreprise}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{stage.titre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {stage.description}
                      </div>
                    </td>
                    <td><span className="badge badge-info">{stage.domaine}</span></td>
                    <td style={{ fontSize: 12 }}>
                      {new Date(stage.date_debut).toLocaleDateString()} <br/>
                      <span style={{ color: 'var(--text-muted)' }}>au</span> {new Date(stage.date_fin).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge status-${stage.statut}`}>
                        {stage.statut === 'en_attente' ? 'En attente' : stage.statut === 'approuve' ? 'Approuvé' : 'Refusé'}
                      </span>
                    </td>
                    <td>
                      {stage.statut === 'en_attente' ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="btn-icon"
                            onClick={() => handleAction(stage._id, 'approve')}
                            title="Approuver"
                            style={{ background: 'var(--success-glow)', color: 'var(--success)', border: 'none', borderRadius: 6, padding: '4px 8px' }}
                          >
                            ✓
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => handleAction(stage._id, 'reject')}
                            title="Refuser"
                            style={{ background: 'var(--error-glow)', color: 'var(--error)', border: 'none', borderRadius: 6, padding: '4px 8px' }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Par: {stage.approuve_par?.email || 'Système'}
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
    </div>
  );
};

export default GestionStagesPage;
