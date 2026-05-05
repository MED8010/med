import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android avec notifications push et mode hors-ligne.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'IA pour prédire les tendances d\'absentéisme et optimiser la planification des ressources.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs avec SAP, Oracle et Microsoft Dynamics pour une synchronisation financière en temps réel.',
      icon: '🏢',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et jalons technologiques pour 2026</p>
        </div>
      </div>

      <div className="section-card">
        <div className="roadmap-timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="roadmap-item animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <div className="roadmap-header">
                  <span className="roadmap-quarter">{milestone.quarter}</span>
                  <span className="roadmap-icon">{milestone.icon}</span>
                </div>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <div className="roadmap-status">
                   <span className="badge badge-info">En Planification</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .roadmap-timeline {
          position: relative;
          padding: 20px 0;
          max-width: 800px;
          margin: 0 auto;
        }
        .roadmap-timeline::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border);
        }
        .roadmap-item {
          position: relative;
          padding-left: 60px;
          margin-bottom: 40px;
        }
        .roadmap-item:last-child {
          margin-bottom: 0;
        }
        .roadmap-dot {
          position: absolute;
          left: 11px;
          top: 10px;
          width: 20px;
          height: 20px;
          background: var(--bg-card);
          border: 4px solid var(--primary);
          border-radius: 50%;
          z-index: 2;
        }
        .roadmap-content {
          background: var(--bg-hover);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .roadmap-content:hover {
          transform: translateX(10px);
          border-color: var(--primary);
          box-shadow: var(--shadow);
        }
        .roadmap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .roadmap-quarter {
          font-weight: 800;
          color: var(--primary);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .roadmap-icon {
          font-size: 24px;
        }
        .roadmap-content h3 {
          margin-bottom: 8px;
          font-size: 18px;
        }
        .roadmap-content p {
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        @media (max-width: 768px) {
          .roadmap-timeline::before { left: 15px; }
          .roadmap-dot { left: 6px; }
          .roadmap-item { padding-left: 45px; }
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;
