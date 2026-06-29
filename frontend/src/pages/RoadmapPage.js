import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Dashboard.css';

const milestones = [
  {
    quarter: 'Q1 2026',
    title: 'Système QR v2 Avançé',
    description: 'Nouveaux badges sécurisés avec cryptage dynamique et intégration des contrôles d\'accès physiques.',
    icon: '🔐',
    status: 'planned'
  },
  {
    quarter: 'Q2 2026',
    title: 'Application Mobile Native',
    description: 'Lancement des versions iOS et Android avec notifications push et mode hors-ligne.',
    icon: '📱',
    status: 'planned'
  },
  {
    quarter: 'Q3 2026',
    title: 'Analytiques IA & Prédictions',
    description: 'Utilisation du Machine Learning pour prédire l\'absentéisme et optimiser la planification des ressources.',
    icon: '🧠',
    status: 'planned'
  },
  {
    quarter: 'Q4 2026',
    title: 'Intégration ERP Totale',
    description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Sage).',
    icon: '🔄',
    status: 'planned'
  }
];

const RoadmapPage = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur 2026</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques de HR Manager</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className="roadmap-item"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="roadmap-point">
                <span className="roadmap-icon">{milestone.icon}</span>
            </div>
            <div className="section-card roadmap-card">
              <div className="roadmap-header">
                <span className="quarter-badge">{milestone.quarter}</span>
                <h3 className="roadmap-title">{milestone.title}</h3>
              </div>
              <p className="roadmap-desc">{milestone.description}</p>
              <div className="roadmap-status">
                <span className="dot"></span> État : En planification
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .roadmap-timeline {
          position: relative;
          max-width: 1000px;
          margin: 40px auto;
          padding: 20px 0;
        }

        .roadmap-timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--primary-glow);
          transform: translateX(-50%);
        }

        .roadmap-item {
          display: flex;
          justify-content: flex-end;
          padding-right: 50%;
          position: relative;
          margin-bottom: 40px;
          width: 100%;
        }

        .roadmap-item:nth-child(even) {
          justify-content: flex-start;
          padding-right: 0;
          padding-left: 50%;
        }

        .roadmap-point {
          position: absolute;
          left: 50%;
          top: 30px;
          width: 50px;
          height: 50px;
          background: var(--bg-card);
          border: 3px solid var(--primary);
          border-radius: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .roadmap-icon {
          font-size: 24px;
        }

        .roadmap-card {
          width: 90%;
          margin: 0;
          transition: transform 0.3s ease;
          border-left: 4px solid var(--primary);
        }

        .roadmap-item:nth-child(even) .roadmap-card {
          border-left: none;
          border-right: 4px solid var(--primary);
        }

        .roadmap-card:hover {
          transform: translateY(-5px);
        }

        .quarter-badge {
          background: var(--primary-glow);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
          display: inline-block;
        }

        .roadmap-title {
          margin: 10px 0;
          color: var(--text-primary);
        }

        .roadmap-desc {
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .roadmap-status {
          margin-top: 15px;
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          display: inline-block;
        }

        @media (max-width: 768px) {
          .roadmap-timeline::before {
            left: 30px;
          }
          .roadmap-item, .roadmap-item:nth-child(even) {
            justify-content: flex-start;
            padding-left: 80px;
            padding-right: 0;
          }
          .roadmap-point {
            left: 30px;
          }
        }
      `}} />
    </div>
  );
};

export default RoadmapPage;
