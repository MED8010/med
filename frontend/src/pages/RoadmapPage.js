import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2',
      description: 'Déploiement de badges QR sécurisés avec rotation dynamique et validation hors-ligne.',
      status: 'planned',
      icon: '🛡️'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés (self-service, pointage GPS).',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Algorithmes de prédiction d\'absentéisme et optimisation automatique des plannings.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation temps réel.',
      status: 'planned',
      icon: '🔄'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Développement et Innovations à venir (2026)</p>
        </div>
      </div>

      <div className="stats-box animate-slide-in">
        <div style={{ padding: '20px 0' }}>
          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute', left: '20px', top: '0', bottom: '0',
              width: '2px', background: 'var(--border)', zIndex: 0
            }}></div>

            {milestones.map((ms, index) => (
              <div key={index} style={{ position: 'relative', marginBottom: '40px' }}>
                {/* Timeline Dot */}
                <div style={{
                  position: 'absolute', left: '-27px', top: '5px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: 'var(--bg-card)', border: '4px solid var(--primary)',
                  zIndex: 1, boxShadow: '0 0 0 4px var(--bg-card)'
                }}></div>

                <div className="section-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-primary">{ms.quarter}</span>
                    <span style={{ fontSize: '24px' }}>{ms.icon}</span>
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{ms.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{ms.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
