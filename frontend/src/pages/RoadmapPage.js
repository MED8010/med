import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push et géolocalisation pour le pointage.',
      icon: '📱',
      color: 'var(--primary)',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration d\'algorithmes d\'IA pour prédire l\'absentéisme et optimiser la planification des ressources humaines.',
      icon: '🧠',
      color: 'var(--secondary)',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs bidirectionnels avec les principaux ERP du marché (SAP, Oracle, Microsoft Dynamics) pour une synchronisation en temps réel.',
      icon: '🔄',
      color: 'var(--success)',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes de développement</p>
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
          borderRadius: '2px',
          zIndex: 0
        }}></div>

        {milestones.map((ms, index) => (
          <div key={index} className="animate-slide-in" style={{
            display: 'flex',
            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
            marginBottom: '60px',
            position: 'relative',
            zIndex: 1,
            width: '100%'
          }}>
            <div style={{
              width: '45%',
              background: 'var(--bg-card)',
              border: `1px solid ${ms.color}`,
              borderRadius: 'var(--radius-lg)',
              padding: '25px',
              boxShadow: 'var(--shadow)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                [index % 2 === 0 ? 'right' : 'left']: '-50px',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: ms.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: `0 0 15px ${ms.color}66`
              }}>
                {ms.icon}
              </div>

              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                color: ms.color,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'block',
                marginBottom: '8px'
              }}>
                {ms.quarter}
              </span>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>{ms.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                {ms.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card mt-6" style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ justifyContent: 'center' }}>🚀 Vers une gestion RH 4.0</h2>
        <p style={{ maxWidth: '700px', margin: '15px auto', color: 'var(--text-secondary)' }}>
          Notre engagement est de fournir des outils technologiques de pointe pour accompagner la transformation digitale
          de votre entreprise et améliorer l'expérience collaborateur.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
