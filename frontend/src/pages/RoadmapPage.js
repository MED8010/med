import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement de l\'application iOS et Android pour les employés. Consultation des fiches de paie et demandes de congés simplifiées.',
      status: 'planned',
      color: 'var(--primary)'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytics IA & Prédictions',
      description: 'Intégration de l\'intelligence artificielle pour prédire les taux d\'absentéisme et optimiser la planification des ressources humaines.',
      status: 'planned',
      color: 'var(--secondary)'
    },
    {
      quarter: 'Q4 2026',
      title: '🔄 Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle en temps réel avec les principaux logiciels ERP du marché (SAP, Oracle, Odoo).',
      status: 'planned',
      color: 'var(--success)'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur 2026</h1>
          <p className="page-subtitle">Découvrez les prochaines étapes de notre évolution technologique</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ position: 'relative', padding: '40px 0' }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'var(--border)',
          transform: 'translateX(-50%)',
          borderRadius: '2px'
        }}></div>

        {milestones.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
            alignItems: 'center',
            width: '100%',
            marginBottom: '60px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              width: '24px',
              height: '24px',
              background: item.color,
              borderRadius: '50%',
              transform: 'translateX(-50%)',
              border: '4px solid var(--bg)',
              boxShadow: 'var(--shadow)',
              zIndex: 2
            }}></div>

            <div className="section-card animate-slide-in" style={{
              width: '45%',
              position: 'relative',
              textAlign: index % 2 === 0 ? 'right' : 'left',
              borderTop: `4px solid ${item.color}`
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                color: item.color,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>{item.quarter}</span>
              <h3 style={{ margin: '10px 0', justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{item.description}</p>
              <div style={{ marginTop: '15px' }}>
                <span className="badge badge-info">Planifié</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card text-center" style={{ marginTop: '40px' }}>
        <h2>🚀 Vers une gestion RH augmentée</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)' }}>
          Notre vision pour 2026 est de transformer radicalement l'expérience collaborateur en plaçant l'innovation technologique au service de l'humain.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
