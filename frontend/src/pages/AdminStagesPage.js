import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const AdminStagesPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('tous');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await apiClient.get('/stages');
      setRequests(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Voulez-vous vraiment approuver cette demande ?')) return;
    try {
      await apiClient.put(`/stages/${id}/approve`);
      loadRequests();
    } catch (err) {
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return alert('Veuillez saisir un motif');
    try {
      await apiClient.put(`/stages/${selectedRequest._id}/reject`, { motif_refus: rejectReason });
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
      loadRequests();
    } catch (err) {
      alert('Erreur lors du refus');
    }
  };

  const filteredRequests = requests.filter(r =>
    filter === 'tous' ? true : r.statut === filter
  );

  if (loading) return <div className="loading"><div className="spinner"></div>Chargement...</div>;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Gestion des Stages</h1>
          <p className="page-subtitle">Administration et approbation des demandes de stage</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${filter === 'tous' ? 'active' : ''}`}
          onClick={() => setFilter('tous')}
        >
          📋 Toutes ({requests.length})
        </button>
        <button
          className={`tab-btn ${filter === 'en_attente' ? 'active' : ''}`}
          onClick={() => setFilter('en_attente')}
        >
          ⏳ En attente ({requests.filter(r => r.statut === 'en_attente').length})
        </button>
        <button
          className={`tab-btn ${filter === 'approuve' ? 'active' : ''}`}
          onClick={() => setFilter('approuve')}
        >
          ✅ Approuvées ({requests.filter(r => r.statut === 'approuve').length})
        </button>
        <button
          className={`tab-btn ${filter === 'refuse' ? 'active' : ''}`}
          onClick={() => setFilter('refuse')}
        >
          ❌ Refusées ({requests.filter(r => r.statut === 'refuse').length})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

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
              {filteredRequests.map(request => (
                <tr key={request._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                        {request.employe?.prenom?.[0]}{request.employe?.nom?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{request.employe?.prenom} {request.employe?.nom}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{request.employe?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{request.titre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{request.entreprise}</div>
                  </td>
                  <td>
                    <span className="badge badge-info">{request.domaine}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>
                      Du {new Date(request.date_debut).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: 13 }}>
                      Au {new Date(request.date_fin).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      request.statut === 'approuve' ? 'badge-success' :
                      request.statut === 'refuse' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {request.statut === 'en_attente' ? 'En attente' :
                       request.statut === 'approuve' ? 'Approuvée' : 'Refusée'}
                    </span>
                    {request.motif_refus && (
                      <div style={{ fontSize: 10, color: 'var(--danger)', marginTop: 4, maxWidth: 150 }}>
                        Motif: {request.motif_refus}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {request.statut === 'en_attente' && (
                        <>
                          <button
                            className="btn-approve"
                            title="Approuver"
                            onClick={() => handleApprove(request._id)}
                          >
                            ✅
                          </button>
                          <button
                            className="btn-reject"
                            title="Refuser"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRejectModal(true);
                            }}
                          >
                            ❌
                          </button>
                        </>
                      )}
                      <button className="btn-view" title="Détails" onClick={() => alert(request.description)}>
                        👁️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Aucune demande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Refuser la demande de stage</h3>
              <button className="close-btn" onClick={() => setShowRejectModal(false)}>✕</button>
            </div>
            <div style={{ padding: '20px 0' }}>
              <p>Veuillez indiquer le motif du refus pour <strong>{selectedRequest?.titre}</strong> :</p>
              <textarea
                className="form-group textarea"
                style={{ width: '100%', marginTop: 15, padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
                rows="4"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Période non disponible, documents manquants..."
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowRejectModal(false)}>Annuler</button>
              <button className="btn-primary" style={{ background: 'var(--danger)' }} onClick={handleReject}>Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStagesPage;
