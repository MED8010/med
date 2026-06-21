import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2',
      description: 'Lancement des badges dynamiques avec expiration et authentification renforcée.',
      icon: '🎫',
      status: 'planned'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Déploiement sur iOS et Android pour une gestion en temps réel par les employés.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Détection intelligente des tendances d\'absentéisme et prévisions budgétaires de paie.',
      icon: '🧠',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle automatique avec les systèmes comptables et production.',
      icon: '🏢',
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

      <div className="roadmap-timeline">
        {milestones.map((ms, index) => (
          <div key={index} className="roadmap-item animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="roadmap-quarter">{ms.quarter}</div>
            <div className="section-card roadmap-card">
              <div className="roadmap-icon-box">{ms.icon}</div>
              <div className="roadmap-content">
                <h3>{ms.title}</h3>
                <p>{ms.description}</p>
                <div className="badge badge-primary">Planifié</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .roadmap-timeline {
          position: relative;
          max-width: 800px;
          margin: 40px auto;
          padding-left: 30px;
          border-left: 3px dashed var(--primary-glow);
        }

        .roadmap-item {
          position: relative;
          margin-bottom: 40px;
        }

        .roadmap-item::before {
          content: '';
          position: absolute;
          left: -37px;
          top: 20px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--primary);
          border: 3px solid var(--bg);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .roadmap-quarter {
          font-weight: 800;
          color: var(--primary);
          font-size: 14px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .roadmap-card {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 20px;
        }

        .roadmap-icon-box {
          font-size: 32px;
          background: var(--primary-glow);
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          flex-shrink: 0;
        }

        .roadmap-content h3 {
          margin-bottom: 8px;
          font-size: 18px;
        }

        .roadmap-content p {
          color: var(--text-secondary);
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;
