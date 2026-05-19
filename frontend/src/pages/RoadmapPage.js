import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: '2026 - Q2',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour un accès nomade.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: '2026 - Q3',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'IA pour prédire les besoins en recrutement et analyser les tendances.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: '2026 - Q4',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics.',
      icon: '🔌',
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

      <div className="section-card animate-slide-in">
        <div className="timeline-container" style={{ padding: '20px 0' }}>
          {milestones.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '40px',
              position: 'relative'
            }}>
              {/* Timeline line */}
              {index !== milestones.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '26px',
                  top: '52px',
                  bottom: '-40px',
                  width: '2px',
                  background: 'var(--border)',
                  zIndex: 0
                }}></div>
              )}

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
                zIndex: 1,
                border: '2px solid var(--primary)'
              }}>
                {item.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '4px'
                }}>
                  <span className="badge badge-primary" style={{ padding: '2px 8px' }}>
                    {item.quarter}
                  </span>
                  <h3 style={{ margin: 0 }}>{item.title}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
