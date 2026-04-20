import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Optimisation Infrastructure',
      description: 'Mise à niveau des serveurs et optimisation des bases de données NoSQL pour supporter 10 000+ employés.',
      icon: '⚙️',
      status: 'planned'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android avec notifications push et pointage géolocalisé.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques Prédictives IA',
      description: 'Intégration de modèles de machine learning pour prédire l\'absentéisme et optimiser la planification.',
      icon: '🧠',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation financière en temps réel.',
      icon: '🔗',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur 2026</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques</p>
        </div>
      </div>

      <div className="stats-box" style={{ marginBottom: 30 }}>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
          Notre engagement est de fournir la solution RH la plus avancée du marché.
          Voici les étapes clés de notre développement pour l'année 2026.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {milestones.map((m, index) => (
          <div key={index} className="section-card animate-slide-in" style={{
            display: 'flex',
            gap: 25,
            alignItems: 'center',
            borderLeft: `5px solid ${index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'}`,
            animationDelay: `${index * 0.1}s`
          }}>
            <div style={{
              fontSize: '40px',
              background: 'var(--bg-hover)',
              width: 80,
              height: 80,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {m.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{
                  background: 'var(--primary-glow)',
                  color: 'var(--primary)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  {m.quarter}
                </span>
              </div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{m.title}</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
