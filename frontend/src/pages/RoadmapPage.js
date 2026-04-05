import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const features = [
    {
      category: 'Scanner & Pointage',
      items: [
        { title: 'Mode Automatique', status: 'Terminé', description: 'Détection intelligente Entrée/Sortie sans action manuelle.' },
        { title: 'Scanner Mobile Natif', status: 'En cours', description: 'Application mobile dédiée pour le scan des badges.' },
        { title: 'Géofencing', status: 'Planifié', description: 'Restriction du pointage aux zones géographiques autorisées.' }
      ]
    },
    {
      category: 'Analytiques & IA',
      items: [
        { title: 'Prédiction d\'Absenteisme', status: 'Planifié', description: 'Utilisation du Machine Learning pour anticiper les absences.' },
        { title: 'Optimisation des Plannings', status: 'En cours', description: 'Algorithme de répartition automatique de la charge de travail.' }
      ]
    },
    {
      category: 'Expérience Employé',
      items: [
        { title: 'Portail Self-Service', status: 'Terminé', description: 'Gestion autonome des congés et profil personnel.' },
        { title: 'Notifications Push', status: 'En cours', description: 'Alertes en temps réel sur mobile pour les approbations.' }
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision et Prochaines Évolutions du Système RH</p>
        </div>
      </div>

      <div className="grid-1">
        {features.map((section, idx) => (
          <div key={idx} className="section-card" style={{ marginBottom: 30 }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>{idx === 0 ? '📷' : idx === 1 ? '🧠' : '👤'}</span>
              {section.category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {section.items.map((item, iidx) => (
                <div key={iidx} style={{
                  padding: 20,
                  borderRadius: 12,
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, right: 0,
                    padding: '4px 12px',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: item.status === 'Terminé' ? 'var(--success-bg)' : item.status === 'En cours' ? 'var(--info-bg)' : 'var(--warning-bg)',
                    color: item.status === 'Terminé' ? 'var(--success)' : item.status === 'En cours' ? 'var(--info)' : 'var(--warning)',
                    borderBottomLeftRadius: 12
                  }}>
                    {item.status}
                  </div>
                  <h3 style={{ marginTop: 10, marginBottom: 10, fontSize: 16 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
