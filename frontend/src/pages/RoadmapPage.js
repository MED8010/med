import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push et géolocalisation.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytique Avancée & IA',
      description: 'Moteur de prédiction des absences et optimisation automatique de la planification des ressources via IA.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: '🔌 Intégration ERP Complète',
      description: 'Synchronisation bi-directionnelle avec les principaux ERP du marché (SAP, Oracle, Sage) pour la paie et les RH.',
      status: 'planned',
      icon: '🔌'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et jalons de développement pour 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ marginTop: '40px' }}>
        {milestones.map((milestone, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ marginBottom: '30px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'var(--primary-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {milestone.icon}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px' }}>{milestone.title}</h2>
                  <span className="badge badge-primary" style={{ marginTop: '5px' }}>{milestone.quarter}</span>
                </div>
              </div>
              <span className="badge badge-info">Planifié</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              {milestone.description}
            </p>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ background: 'var(--grad-primary)', color: 'white', marginTop: '40px' }}>
        <h3 style={{ color: 'white' }}>🚀 En route vers l'excellence RH</h3>
        <p style={{ opacity: 0.9 }}>
          Notre engagement est de fournir les outils les plus performants pour la gestion de votre capital humain.
          Ces évolutions marquent notre volonté d'innovation constante.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
