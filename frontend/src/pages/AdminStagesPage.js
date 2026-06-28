import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import '../styles/Dashboard.css';

const AdminStagesPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('en_attente');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/stages');
      setRequests(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action, motif = '') => {
    try {
      if (action === 'approve') {
        await apiClient.put(`/stages/${id}/approve`);
      } else {
        await apiClient.put(`/stages/${id}/reject`, { motif_refus: motif });
      }
      loadRequests();
    } catch (err) {
      alert('Erreur lors de l\'action');
    }
  };

  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter(r => r.statut === filter);

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Gestion des Stages</h1>
          <p className="page-subtitle">Valider et suivre les demandes de stage des collaborateurs</p>
        </div>
      </div>

      <div className="section-card filter-bar-card">
        <div className="filter-container">
          <div className="filter-group">
            <label>Statut</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="approuve">Approuvées</option>
              <option value="refuse">Refusées</option>
            </select>
          </div>
          <button className="btn-secondary" onClick={loadRequests}>🔄 Actualiser</button>
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div>Chargement des demandes...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employé</th>
                <th>Projet / Titre</th>
                <th>Entreprise</th>
                <th>Dates</th>
                <th>Domaine</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    Aucune demande trouvée
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req._id}>
                    <td>
                      <div className="d-flex align-center gap-8">
                        <div className="sidebar-avatar" style={{ width: 30, height: 30, fontSize: 10 }}>
                          {req.employe?.prenom?.[0]}{req.employe?.nom?.[0]}
                        </div>
                        <div>
                          <div className="fw-bold">{req.employe?.prenom} {req.employe?.nom}</div>
                          <div className="text-muted" style={{ fontSize: 11 }}>{req.employe?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold">{req.titre}</div>
                      <div className="text-muted" style={{ fontSize: 11, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.description}
                      </div>
                    </td>
                    <td>{req.entreprise}</td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        <div>Du: {new Date(req.date_debut).toLocaleDateString()}</div>
                        <div>Au: {new Date(req.date_fin).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{req.domaine}</span></td>
                    <td>
                      <span className={`badge badge-${req.statut === 'approuve' ? 'success' : req.statut === 'refuse' ? 'danger' : 'warning'}`}>
                        {req.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {req.statut === 'en_attente' ? (
                        <div className="action-buttons">
                          <button className="btn-approve" title="Approuver" onClick={() => handleAction(req._id, 'approve')}>✓</button>
                          <button className="btn-reject" title="Refuser" onClick={() => {
                            const motif = prompt('Motif du refus :');
                            if (motif) handleAction(req._id, 'reject', motif);
                          }}>✕</button>
                        </div>
                      ) : (
                        <span className="text-muted" style={{ fontSize: 11 }}>Traitée</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStagesPage;
