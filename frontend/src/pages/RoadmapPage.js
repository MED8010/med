import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android avec notifications push et mode hors-ligne.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les tendances d\'absentéisme et optimiser les plannings.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle en temps réel avec les principaux ERP du marché (SAP, Oracle, Microsoft Dynamics).',
      icon: '🔄',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes du développement</p>
        </div>
      </div>

      <div className="section-card">
        <h3>🚀 Jalons 2026</h3>
        <div style={{ marginTop: '30px', position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'var(--primary-glow)',
            zIndex: 0
          }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {milestones.map((ms, index) => (
              <div key={index} className="animate-slide-in" style={{
                display: 'flex',
                gap: '20px',
                position: 'relative',
                zIndex: 1,
                animationDelay: `${index * 0.1}s`
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '3px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {ms.icon}
                </div>
                <div className="stats-box" style={{ flex: 1, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-primary">{ms.quarter}</span>
                    <span className="badge badge-neutral">Planifié</span>
                  </div>
                  <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{ms.title}</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{ms.description}</p>
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
