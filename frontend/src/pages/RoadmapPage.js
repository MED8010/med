import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Dashboard.css';

const milestones = [
  {
    quarter: 'Q1 2026',
    title: 'Système QR v2',
    description: 'Nouveaux algorithmes de détection ultra-rapides et support multi-caméras pour les grands flux d\'employés.',
    status: 'planned',
    icon: '🚀'
  },
  {
    quarter: 'Q2 2026',
    title: 'Application Mobile Native',
    description: 'Lancement des apps iOS et Android avec notifications push temps réel et mode hors-ligne.',
    status: 'planned',
    icon: '📱'
  },
  {
    quarter: 'Q3 2026',
    title: 'Analytiques IA & Prédictions',
    description: 'Moteur d\'intelligence artificielle pour prédire les tendances d\'absentéisme et optimiser les plannings.',
    status: 'planned',
    icon: '🧠'
  },
  {
    quarter: 'Q4 2026',
    title: 'Intégration ERP Totale',
    description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation bidirectionnelle.',
    status: 'planned',
    icon: '🔗'
  }
];

const RoadmapPage = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Stratégique & Prochaines Étapes (2026)</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className="roadmap-card"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="roadmap-quarter">{milestone.quarter}</div>
            <div className="roadmap-content">
              <div className="roadmap-icon">{milestone.icon}</div>
              <div className="roadmap-info">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <div className="status-badge planned">Planifié</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .roadmap-timeline {
          max-width: 900px;
          margin: 40px auto;
          position: relative;
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
          opacity: 0.3;
        }

        .roadmap-card {
          width: 45%;
          margin-bottom: 40px;
          position: relative;
          background: var(--bg-card);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }

        .roadmap-card:nth-child(even) {
          margin-left: auto;
        }

        .roadmap-card::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: var(--primary);
          border-radius: 50%;
          top: 30px;
          box-shadow: 0 0 10px var(--primary);
        }

        .roadmap-card:nth-child(odd)::after {
          right: -11.5%;
        }

        .roadmap-card:nth-child(even)::after {
          left: -11.5%;
        }

        .roadmap-quarter {
          font-weight: 800;
          color: var(--primary);
          font-size: 0.9rem;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .roadmap-content {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .roadmap-icon {
          font-size: 2rem;
          background: var(--primary-glow);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .roadmap-info h3 {
          margin: 0 0 8px 0;
          font-size: 1.25rem;
        }

        .roadmap-info p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .status-badge.planned {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .roadmap-timeline::before {
            left: 20px;
          }
          .roadmap-card {
            width: calc(100% - 60px);
            margin-left: 60px !important;
          }
          .roadmap-card::after {
            left: -51px !important;
          }
        }
      `}} />
    </div>
  );
};

export default RoadmapPage;
