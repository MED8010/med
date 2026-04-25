import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement de l\'application iOS et Android pour les employés avec notifications push en temps réel.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration d\'intelligence artificielle pour prédire les besoins en recrutement et analyser le turnover.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      icon: '🔄',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision et Innovations 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {milestones.map((ms, index) => (
          <div
            key={index}
            className={`roadmap-item animate-slide-in ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <div className="roadmap-card">
              <div className="roadmap-icon">
                {ms.icon}
              </div>

              <div className="roadmap-quarter">
                {ms.quarter}
              </div>
              <h3 className="roadmap-title">{ms.title}</h3>
              <p className="roadmap-description">
                {ms.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="roadmap-footer section-card">
        <h2 className="roadmap-footer-title">🚀 Vers une RH 4.0</h2>
        <p className="roadmap-footer-text">
          Notre engagement est de fournir les outils les plus performants pour accompagner la transformation digitale de votre capital humain.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
