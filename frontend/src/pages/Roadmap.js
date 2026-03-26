import React from 'react';
import '../styles/Dashboard.css';

const Roadmap = () => {
  const roadmapData = [
    {
      quarter: 'Q2 2026',
      title: 'Phase d\'Expansion',
      items: [
        { name: 'Application Mobile (iOS & Android)', status: 'planned', icon: '📱' },
        { name: 'Système de notifications Push', status: 'planned', icon: '🔔' },
        { name: 'Portail Employé en Libre-Service v2', status: 'planned', icon: '👤' }
      ],
      color: '#6366f1'
    },
    {
      quarter: 'Q3 2026',
      title: 'Intelligence Artificielle',
      items: [
        { name: 'Analytique Prédictive des RH', status: 'upcoming', icon: '🤖' },
        { name: 'Optimisation Automatique des Plannings', status: 'upcoming', icon: '📅' },
        { name: 'Chatbot RH pour les questions courantes', status: 'upcoming', icon: '💬' }
      ],
      color: '#a855f7'
    },
    {
      quarter: 'Q4 2026',
      title: 'Automatisation Totale',
      items: [
        { name: 'Génération de paie 100% autonome', status: 'upcoming', icon: '💰' },
        { name: 'Intégration avec les banques locales', status: 'upcoming', icon: '🏦' },
        { name: 'Signature électronique des contrats', status: 'upcoming', icon: '✍️' }
      ],
      color: '#ec4899'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Découvrez les prochaines innovations de votre plateforme RH</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {roadmapData.map((phase, idx) => (
          <div key={idx} className="roadmap-phase" style={{ '--phase-color': phase.color }}>
            <div className="phase-marker">
              <span className="phase-quarter">{phase.quarter}</span>
              <div className="phase-line"></div>
            </div>

            <div className="section-card roadmap-card animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <h2 className="phase-title">{phase.title}</h2>
              <div className="roadmap-items">
                {phase.items.map((item, iidx) => (
                  <div key={iidx} className="roadmap-item">
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-content">
                      <div className="item-name">{item.name}</div>
                      <span className={`status-badge ${item.status}`}>
                        {item.status === 'planned' ? 'Planifié' : 'En développement'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .roadmap-timeline {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 40px;
          position: relative;
        }

        .roadmap-phase {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 40px;
        }

        .phase-marker {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding-top: 10px;
        }

        .phase-quarter {
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--phase-color);
          background: var(--primary-glow);
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid var(--phase-color);
        }

        .phase-line {
          width: 2px;
          flex-grow: 1;
          background: linear-gradient(to bottom, var(--phase-color), transparent);
          margin-right: 35px;
          margin-top: 15px;
        }

        .roadmap-card {
          border-left: 5px solid var(--phase-color);
          margin-bottom: 0;
        }

        .phase-title {
          margin-top: 0;
          margin-bottom: 25px;
          font-size: 1.5rem;
          color: var(--text-primary);
        }

        .roadmap-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .roadmap-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: var(--bg-hover);
          border-radius: 12px;
          transition: transform 0.2s ease;
        }

        .roadmap-item:hover {
          transform: translateY(-3px);
          background: var(--primary-glow);
        }

        .item-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-card);
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .item-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .status-badge {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .status-badge.planned {
          background: var(--info-bg);
          color: var(--info);
        }

        .status-badge.upcoming {
          background: var(--warning-bg);
          color: var(--warning);
        }

        @media (max-width: 768px) {
          .roadmap-phase {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .phase-marker {
            align-items: flex-start;
          }
          .phase-line {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Roadmap;
