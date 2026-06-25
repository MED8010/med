import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const AdminStagesPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('en_attente');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [rejectId, setRejectId] = useState(null);
  const [motifRefus, setMotifRefus] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/stages');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des demandes' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiClient.put(`/stages/${id}/approve`);
      setMessage({ type: 'success', text: 'Demande de stage approuvée avec succès' });
      loadRequests();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'approbation' });
    }
  };

  const handleReject = async () => {
    if (!motifRefus) return alert('Veuillez saisir un motif de refus');
    try {
      await apiClient.put(`/stages/${rejectId}/reject`, { motif_refus: motifRefus });
      setMessage({ type: 'success', text: 'Demande de stage refusée' });
      setRejectId(null);
      setMotifRefus('');
      loadRequests();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du refus' });
    }
  };

  const filteredRequests = requests.filter(r => filter === 'tous' || r.statut === filter);

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🎓 Gestion des Stages</h1>
          <p className="page-subtitle">Administration des demandes d'immersion professionnelle</p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
          {message.text}
        </div>
      )}

      <div className="section-card" style={{ marginBottom: 25 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Filtrer par statut:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            <option value="tous">Tous les stages</option>
            <option value="en_attente">En attente</option>
            <option value="approuve">Approuvés</option>
            <option value="refuse">Refusés</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="loading"><div className="spinner"></div>Chargement...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Projet / Titre</th>
                <th>Domaine / Entreprise</th>
                <th>Période</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    Aucune demande trouvée
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.employe?.prenom} {req.employe?.nom}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{req.employe?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.titre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.description}
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-info">{req.domaine}</div>
                      <div style={{ marginTop: 4, fontWeight: 500 }}>{req.entreprise}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        Du {new Date(req.date_debut).toLocaleDateString('fr-FR')}
                      </div>
                      <div style={{ fontSize: 12 }}>
                        Au {new Date(req.date_fin).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        req.statut === 'approuve' ? 'badge-success' :
                        req.statut === 'refuse' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {req.statut === 'en_attente' ? 'En attente' : req.statut.charAt(0).toUpperCase() + req.statut.slice(1)}
                      </span>
                    </td>
                    <td>
                      {req.statut === 'en_attente' ? (
                        <div className="action-buttons">
                          <button className="btn-approve" onClick={() => handleApprove(req._id)} title="Approuver">✅</button>
                          <button className="btn-reject" onClick={() => setRejectId(req._id)} title="Refuser">❌</button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Traité le {new Date(req.date_approuve).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {rejectId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Refuser la demande</h3>
              <button className="close-btn" onClick={() => setRejectId(null)}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13 }}>Motif du refus *</label>
              <textarea
                className="form-group"
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', minHeight: 100 }}
                value={motifRefus}
                onChange={(e) => setMotifRefus(e.target.value)}
                placeholder="Expliquez la raison du refus..."
              ></textarea>
              <div className="modal-footer" style={{ padding: '16px 0 0 0', border: 'none' }}>
                <button className="btn-secondary" onClick={() => setRejectId(null)}>Annuler</button>
                <button className="btn-primary" style={{ background: 'var(--danger)' }} onClick={handleReject}>Confirmer le refus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStagesPage;
