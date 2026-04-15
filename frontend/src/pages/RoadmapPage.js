import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile',
      description: 'Lancement des applications iOS et Android pour les employés.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'IA & Analytics HR',
      description: 'Analyses prédictives pour la gestion des talents et de l\'absentéisme.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché.',
      icon: '🔄',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision et Développements pour 2026</p>
        </div>
      </div>

      <div className="section-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30, padding: '20px 0' }}>
          {milestones.map((m, index) => (
            <div key={index} className="animate-slide-in" style={{
              display: 'flex',
              gap: 24,
              padding: 24,
              background: 'var(--bg-hover)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              position: 'relative'
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '15px',
                background: 'var(--grad-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, flexShrink: 0, boxShadow: 'var(--shadow-primary)'
              }}>
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{m.title}</h2>
                  <span className="badge badge-primary">{m.quarter}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{m.description}</p>
              </div>
              {index < milestones.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: 54,
                  bottom: -30,
                  width: 2,
                  height: 30,
                  background: 'var(--border)',
                  zIndex: -1
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
