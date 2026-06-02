import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Déploiement de la reconnaissance faciale optionnelle et badges QR dynamiques encryptés.',
      status: 'planned',
      icon: '🛡️'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des versions iOS et Android pour les employés avec notifications push en temps réel.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'IA pour prédire les tendances d\'absentéisme et optimiser la planification des congés.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      status: 'planned',
      icon: '🔄'
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

      <div className="roadmap-timeline animate-slide-in">
        {milestones.map((ms, index) => (
          <div key={index} className="roadmap-item section-card">
            <div className="roadmap-marker">
              <div className="marker-icon">{ms.icon}</div>
              <div className="marker-line"></div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-header">
                <span className="roadmap-quarter badge badge-primary">{ms.quarter}</span>
                <span className="roadmap-status badge badge-info">À venir</span>
              </div>
              <h3 className="roadmap-title">{ms.title}</h3>
              <p className="roadmap-description">{ms.description}</p>

              <div className="roadmap-progress-preview">
                <div className="progress-label">Phase de conception</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '10%', background: 'var(--grad-primary)' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card mt-6">
        <h3>💡 Suggestion de fonctionnalités</h3>
        <p>Le futur de RH Manager se construit avec vous. N'hésitez pas à contacter l'équipe technique pour proposer des améliorations.</p>
        <button className="btn-primary mt-4">Soumettre une idée</button>
      </div>

      <style>{`
        .roadmap-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          padding-left: 20px;
        }

        .roadmap-item {
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
          background: var(--bg-card);
          border-left: 4px solid var(--primary);
          position: relative;
        }

        .roadmap-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 40px;
          flex-shrink: 0;
        }

        .marker-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-sidebar);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          z-index: 2;
          box-shadow: var(--shadow);
          border: 2px solid var(--primary);
        }

        .roadmap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .roadmap-title {
          font-size: 18px;
          margin: 10px 0;
          color: var(--text-primary);
        }

        .roadmap-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .roadmap-progress-preview {
          background: var(--bg-hover);
          padding: 15px;
          border-radius: var(--radius-md);
        }

        .progress-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;
