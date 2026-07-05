import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const GestionStagesPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('en_attente');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [refusalModal, setRefusalModal] = useState({ show: false, id: '', motif: '' });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/stages');
      setRequests(response.data);
    } catch (error) {
      console.error('Erreur chargement stages:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des demandes' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action, motif = '') => {
    try {
      if (action === 'approve') {
        await apiClient.put(`/stages/${id}/approve`);
        setMessage({ type: 'success', text: 'Demande approuvée avec succès' });
      } else {
        await apiClient.put(`/stages/${id}/reject`, { motif_refus: motif });
        setMessage({ type: 'success', text: 'Demande refusée' });
        setRefusalModal({ show: false, id: '', motif: '' });
      }
      loadRequests();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'action' });
    }
  };

  const filteredRequests = requests.filter(req => filter === 'all' || req.statut === filter);

  if (loading && requests.length === 0) {
    return <div className="loading">Chargement des demandes...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Gestion des Stages</h1>
          <p className="page-subtitle">Validation et suivi des demandes de stage</p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`} style={{ marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="filter-group" style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn-secondary ${filter === 'en_attente' ? 'active' : ''}`}
              onClick={() => setFilter('en_attente')}
              style={{ background: filter === 'en_attente' ? 'var(--primary)' : '', color: filter === 'en_attente' ? 'white' : '' }}
            >
              En Attente
            </button>
            <button
              className={`btn-secondary ${filter === 'approuve' ? 'active' : ''}`}
              onClick={() => setFilter('approuve')}
              style={{ background: filter === 'approuve' ? 'var(--success)' : '', color: filter === 'approuve' ? 'white' : '' }}
            >
              Approuvées
            </button>
            <button
              className={`btn-secondary ${filter === 'refuse' ? 'active' : ''}`}
              onClick={() => setFilter('refuse')}
              style={{ background: filter === 'refuse' ? 'var(--error)' : '', color: filter === 'refuse' ? 'white' : '' }}
            >
              Refusées
            </button>
            <button
              className={`btn-secondary ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Toutes
            </button>
          </div>
          <span className="text-muted">{filteredRequests.length} demande(s) trouvée(s)</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Titre / Entreprise</th>
                <th>Dates</th>
                <th>Domaine</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <tr key={req._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{req.employe?.prenom} {req.employe?.nom}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.employe?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{req.titre}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.entreprise}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>
                      {new Date(req.date_debut).toLocaleDateString('fr-FR')} - {new Date(req.date_fin).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td><span className="badge badge-info">{req.domaine}</span></td>
                  <td>
                    <span className={`badge ${
                      req.statut === 'approuve' ? 'badge-success' :
                      req.statut === 'refuse' ? 'badge-error' : 'badge-warning'
                    }`}>
                      {req.statut === 'en_attente' ? 'En attente' :
                       req.statut === 'approuve' ? 'Approuvée' : 'Refusée'}
                    </span>
                  </td>
                  <td>
                    {req.statut === 'en_attente' && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className="btn-icon"
                          onClick={() => handleAction(req._id, 'approve')}
                          title="Approuver"
                          style={{ color: 'var(--success)' }}
                        >
                          Check
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => setRefusalModal({ show: true, id: req._id, motif: '' })}
                          title="Refuser"
                          style={{ color: 'var(--error)' }}
                        >
                          X
                        </button>
                      </div>
                    )}
                    {req.statut === 'refuse' && req.motif_refus && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--error)', maxWidth: '150px' }}>
                        Motif: {req.motif_refus}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Aucune demande trouvée pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {refusalModal.show && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="section-card" style={{ width: '400px', maxWidth: '90%' }}>
            <h3>Motif du refus</h3>
            <textarea
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '100px', marginTop: '10px' }}
              placeholder="Veuillez indiquer la raison du refus..."
              value={refusalModal.motif}
              onChange={(e) => setRefusalModal({ ...refusalModal, motif: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button className="btn-secondary" onClick={() => setRefusalModal({ show: false, id: '', motif: '' })}>Annuler</button>
              <button
                className="btn-primary"
                style={{ background: 'var(--error)', borderColor: 'var(--error)' }}
                disabled={!refusalModal.motif.trim()}
                onClick={() => handleAction(refusalModal.id, 'reject', refusalModal.motif)}
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionStagesPage;
