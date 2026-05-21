import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push en temps réel.',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytiques IA & Prédictions',
      description: 'Mise en œuvre de modèles prédictifs pour anticiper les besoins en recrutement et les risques de turnover.',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: '🔄 Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo) pour la paie et la comptabilité.',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions majeures pour 2026</p>
        </div>
      </div>

      <div className="section-card">
        <div className="roadmap-timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="roadmap-item animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="roadmap-quarter">{milestone.quarter}</div>
              <div className="roadmap-content">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <span className="badge badge-primary">Planifié</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2 mt-6">
        <div className="stats-box">
          <h3>🚀 Vision 2026</h3>
          <p>Notre objectif est de transformer la gestion RH en une expérience fluide, mobile et augmentée par l'intelligence artificielle.</p>
        </div>
        <div className="stats-box">
          <h3>🛠️ En Développement</h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>Optimisation du moteur de calcul de paie</li>
            <li>Refonte de l'interface utilisateur (v3)</li>
            <li>Module de gestion de carrière avancé</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .roadmap-timeline {
          position: relative;
          padding-left: 30px;
          border-left: 2px solid var(--primary-glow);
          margin: 20px 0;
        }
        .roadmap-item {
          position: relative;
          margin-bottom: 40px;
        }
        .roadmap-item::before {
          content: '';
          position: absolute;
          left: -37px;
          top: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--primary);
          border: 4px solid var(--bg-card);
          box-shadow: 0 0 0 2px var(--primary-glow);
        }
        .roadmap-quarter {
          font-weight: 800;
          color: var(--primary);
          font-size: 14px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .roadmap-content {
          background: var(--bg-hover);
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }
        .roadmap-content h3 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        .roadmap-content p {
          color: var(--text-secondary);
          margin-bottom: 15px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;
