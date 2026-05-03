import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement de l\'application iOS et Android pour les employés (Pointage GPS, demandes de congés, fiches de paie).',
      status: 'upcoming',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytiques IA & Prédictions',
      description: 'Mise en œuvre d\'algorithmes prédictifs pour l\'absentéisme et optimisation de la planification des ressources.',
      status: 'upcoming',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: '🔗 Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle complète avec SAP et Oracle ERP pour une gestion financière unifiée.',
      status: 'upcoming',
      icon: '🔗'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Stratégique & Évolutions de la Plateforme (2026)</p>
        </div>
      </div>

      <div className="section-card animate-slide-in">
        <div style={{ padding: '20px 0' }}>
          <div className="timeline-container" style={{ position: 'relative', paddingLeft: '40px' }}>
            <div style={{
              position: 'absolute',
              left: '19px',
              top: '0',
              bottom: '0',
              width: '2px',
              background: 'var(--primary-glow)',
              zIndex: 0
            }}></div>

            {milestones.map((m, index) => (
              <div key={index} className="milestone-item" style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={{
                  position: 'absolute',
                  left: '-31px',
                  top: '5px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  border: '4px solid var(--bg-card)',
                  zIndex: 1,
                  boxShadow: 'var(--shadow-sm)'
                }}></div>

                <div className="milestone-content" style={{
                  padding: '24px',
                  background: 'var(--bg-hover)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '12px' }}>{m.quarter}</span>
                    <span style={{ fontSize: '24px' }}>{m.icon}</span>
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700' }}>{m.title}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'var(--info-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--info)',
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '24px' }}>💡</span>
          <p style={{ margin: 0, color: 'var(--info)', fontWeight: '500' }}>
            Cette roadmap est donnée à titre indicatif et peut évoluer selon les priorités stratégiques de l'entreprise.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
