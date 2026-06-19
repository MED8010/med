import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Offline',
      description: 'Lancement du nouveau système de scan avec support hors-ligne et synchronisation intelligente. Amélioration de la précision des pointages.',
      status: 'upcoming',
      icon: '📱'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Sortie des applications iOS et Android pour les employés. Notifications push en temps réel pour les validations de congés et rappels de pointage.',
      status: 'upcoming',
      icon: '🚀'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration d\'algorithmes d\'intelligence artificielle pour prédire l\'absentéisme et optimiser la planification des ressources humaines.',
      status: 'upcoming',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connexion directe avec les principaux logiciels de comptabilité et de production pour une automatisation totale des flux RH.',
      status: 'upcoming',
      icon: '🔗'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur 2026</h1>
          <p className="page-subtitle">Vision Stratégique & Évolutions du Système RH</p>
        </div>
      </div>

      <div className="section-card">
        <div style={{ padding: '20px 0' }}>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '800px' }}>
            Découvrez les prochaines étapes majeures de l'évolution de notre plateforme. Nous nous engageons à fournir des outils toujours plus performants et innovants pour la gestion de vos ressources humaines.
          </p>

          <div className="timeline" style={{ position: 'relative', paddingLeft: '30px', borderLeft: '2px solid var(--primary-glow)' }}>
            {milestones.map((ms, index) => (
              <div key={index} className="timeline-item" style={{ marginBottom: '40px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '-41px',
                  top: '0',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  border: '4px solid var(--bg-card)',
                  boxShadow: 'var(--shadow-sm)'
                }}></div>

                <div className="milestone-content" style={{
                  background: 'var(--bg-hover)',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  marginLeft: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '12px', padding: '5px 12px' }}>{ms.quarter}</span>
                    <span style={{ fontSize: '24px' }}>{ms.icon}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>{ms.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>{ms.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginTop: '30px' }}>
        <div className="kpi-card kpi-info">
          <div className="kpi-label">Vision Globale</div>
          <div className="kpi-value" style={{ fontSize: '20px' }}>Digitalisation 100%</div>
          <p className="kpi-subtitle">Objectif fin 2026</p>
        </div>
        <div className="kpi-card kpi-success">
          <div className="kpi-label">Satisfaction</div>
          <div className="kpi-value" style={{ fontSize: '20px' }}>Qualité & Support</div>
          <p className="kpi-subtitle">Priorité absolue</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
