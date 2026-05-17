import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour une gestion en déplacement.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Utilisation de l\'intelligence artificielle pour prédire les tendances d\'absentéisme et optimiser les plannings.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle complète avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      icon: '🔄',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Nos prochaines étapes majeures pour 2026</p>
        </div>
      </div>

      <div className="section-card">
        <div className="roadmap-timeline">
          {milestones.map((m, index) => (
            <div key={index} className="animate-slide-in" style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '40px',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
                zIndex: 2
              }}>
                {m.icon}
              </div>

              {index !== milestones.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '30px',
                  top: '60px',
                  bottom: '-40px',
                  width: '2px',
                  background: 'var(--border)',
                  zIndex: 1
                }}></div>
              )}

              <div style={{ flex: 1, paddingTop: '10px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{m.title}</h2>
                  <span className="badge badge-primary">{m.quarter}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
