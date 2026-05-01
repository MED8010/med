import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android avec notifications push temps réel et mode hors-ligne pour les sites reculés.',
      icon: '📱',
      color: 'var(--primary)'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les pics d\'absentéisme et optimiser la planification des ressources.',
      icon: '🤖',
      color: 'var(--secondary)'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Sage) pour une gestion financière unifiée.',
      icon: '🏢',
      color: 'var(--success)'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques 2026</p>
        </div>
        <div className="time-badge">
          <span className="badge badge-primary">PLAN DE DÉVELOPPEMENT 2026</span>
        </div>
      </div>

      <div className="section-card">
        <div style={{ position: 'relative', padding: '20px 0' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: '20px', top: 0, bottom: 0,
            width: '4px', background: 'var(--border)', borderRadius: '2px'
          }}></div>

          {milestones.map((ms, index) => (
            <div key={index} className="animate-slide-in" style={{
              display: 'flex', gap: '30px', marginBottom: '40px',
              position: 'relative', animationDelay: `${index * 0.1}s`
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: ms.color, color: 'white', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                zIndex: 1, flexShrink: 0, boxShadow: '0 0 0 10px var(--bg-card)'
              }}>
                {ms.icon}
              </div>

              <div className="stats-box" style={{ flex: 1, marginTop: '-5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge" style={{ background: `${ms.color}20`, color: ms.color }}>{ms.quarter}</span>
                </div>
                <h2 style={{ fontSize: '18px', margin: '0 0 10px 0', color: 'var(--text-primary)' }}>{ms.title}</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{ms.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '30px' }}>
        <div className="kpi-card kpi-info">
          <div className="kpi-card-top">
            <div className="kpi-icon-box">🚀</div>
          </div>
          <p className="kpi-label">Objectif Innovation</p>
          <h3 className="kpi-value">100%</h3>
          <p className="kpi-subtitle">Digitalisation des processus RH d'ici fin 2026</p>
        </div>

        <div className="kpi-card kpi-purple">
          <div className="kpi-card-top">
            <div className="kpi-icon-box">🌍</div>
          </div>
          <p className="kpi-label">Expansion</p>
          <h3 className="kpi-value">Multi-sites</h3>
          <p className="kpi-subtitle">Support multi-devises et multi-langues prévu</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
