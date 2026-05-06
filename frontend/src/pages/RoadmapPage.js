import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement de l\'application iOS & Android pour les employés avec notifications push et géofencing pour le pointage.',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytiques IA & Prédictions',
      description: 'Moteur de prédiction des absences et optimisation de la planification des congés basé sur l\'intelligence artificielle.',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: '🔄 Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle en temps réel avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {milestones.map((milestone, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s`, marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span className="badge badge-primary" style={{ fontSize: '14px', padding: '5px 15px' }}>{milestone.quarter}</span>
              <span className="badge badge-neutral">À venir</span>
            </div>
            <h2 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>{milestone.title}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '16px' }}>{milestone.description}</p>

            <div style={{ marginTop: '20px', height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '0%', background: 'var(--primary)', borderRadius: '2px' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ background: 'var(--primary-glow)', border: '1px border var(--primary)' }}>
        <h3 style={{ color: 'var(--primary)' }}>💡 Suggestion de fonctionnalité ?</h3>
        <p>Notre roadmap est évolutive. Si vous avez des besoins spécifiques, n'hésitez pas à contacter l'équipe produit.</p>
      </div>
    </div>
  );
};

export default RoadmapPage;
