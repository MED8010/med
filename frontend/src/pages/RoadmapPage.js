import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour le pointage mobile avec géofencing et notifications push en temps réel.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les tendances d\'absentéisme et optimiser la planification des effectifs.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation bidirectionnelle de la paie et des ressources.',
      icon: '🔄',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions de la plateforme pour 2026</p>
        </div>
      </div>

      <div className="section-card">
        <div className="timeline" style={{ padding: '20px 0' }}>
          {milestones.map((item, index) => (
            <div key={index} className="timeline-item" style={{
              display: 'flex',
              gap: '30px',
              marginBottom: '40px',
              position: 'relative'
            }}>
              <div className="timeline-left" style={{
                minWidth: '100px',
                textAlign: 'right',
                paddingTop: '5px'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  display: 'block'
                }}>{item.quarter}</span>
              </div>

              <div className="timeline-center" style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  zIndex: 2,
                  boxShadow: 'var(--shadow-primary)'
                }}>
                  {item.icon}
                </div>
                {index !== milestones.length - 1 && (
                  <div style={{
                    width: '2px',
                    height: 'calc(100% + 40px)',
                    background: 'var(--border)',
                    position: 'absolute',
                    top: '40px',
                    zIndex: 1
                  }} />
                )}
              </div>

              <div className="timeline-content" style={{
                flex: 1,
                background: 'var(--bg-card)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                marginTop: '-5px'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700' }}>{item.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.description}</p>
                <div style={{ marginTop: '15px' }}>
                  <span className="badge badge-primary">Planifié</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-box mt-6" style={{ background: 'var(--primary-glow)', border: '1px dashed var(--primary)' }}>
        <h3 style={{ color: 'var(--primary)' }}>💡 Suggestion de fonctionnalité ?</h3>
        <p>Notre roadmap est évolutive. Si vous avez des besoins spécifiques, n'hésitez pas à contacter l'équipe de développement pour soumettre vos idées.</p>
      </div>
    </div>
  );
};

export default RoadmapPage;
