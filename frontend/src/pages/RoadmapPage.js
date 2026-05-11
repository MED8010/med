import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement des versions iOS et Android pour une gestion en mobilité totale.',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytiques IA & Prédictions',
      description: 'Module d\'IA pour prédire l\'absentéisme et optimiser la planification des effectifs.',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: '🏢 Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics.',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes du projet</p>
        </div>
      </div>

      <div className="section-card">
        <div style={{ position: 'relative', paddingLeft: '40px', borderLeft: '2px solid var(--border)' }}>
          {milestones.map((m, index) => (
            <div key={index} className="animate-slide-in" style={{
              marginBottom: '40px',
              position: 'relative',
              animationDelay: `${index * 0.1}s`
            }}>
              <div style={{
                position: 'absolute',
                left: '-51px',
                top: '0',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'var(--grad-primary)',
                border: '4px solid var(--bg-card)',
                boxShadow: '0 0 0 2px var(--primary-glow)'
              }} />

              <div style={{
                background: 'var(--bg-hover)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid var(--border)'
              }}>
                <span className="badge badge-primary" style={{ marginBottom: '12px' }}>{m.quarter}</span>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{m.title}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2 mt-6">
        <div className="section-card kpi-purple">
          <h3>🎯 Notre Vision</h3>
          <p>Devenir la plateforme RH de référence en Afrique d'ici 2027, en combinant simplicité d'utilisation et puissance d'analyse.</p>
        </div>
        <div className="section-card kpi-success">
          <h3>💡 Suggestions ?</h3>
          <p>Votre avis compte ! Contactez l'équipe de développement pour soumettre vos idées de fonctionnalités.</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
