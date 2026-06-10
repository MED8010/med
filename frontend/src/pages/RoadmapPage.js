import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Dashboard.css';

const milestones = [
  {
    quarter: 'Q1 2026',
    title: 'Système QR v2',
    description: 'Nouveaux terminaux de pointage hardware avec reconnaissance faciale intégrée.',
    status: 'planned',
    icon: '📷'
  },
  {
    quarter: 'Q2 2026',
    title: 'Application Mobile Native',
    description: 'Lancement des apps iOS et Android pour les employés avec notifications push.',
    status: 'planned',
    icon: '📱'
  },
  {
    quarter: 'Q3 2026',
    title: 'Analytiques IA & Prédictions',
    description: 'Algorithmes de prédiction des absences et optimisation des plannings via IA.',
    status: 'planned',
    icon: '🤖'
  },
  {
    quarter: 'Q4 2026',
    title: 'Intégration ERP Totale',
    description: 'Synchronisation bidirectionnelle avec SAP, Oracle et Microsoft Dynamics.',
    status: 'planned',
    icon: '🏢'
  }
];

const RoadmapPage = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Roadmap Futur
          </motion.h1>
          <p className="page-subtitle">Vision Technologique & Jalons de Développement 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {milestones.map((m, index) => (
          <motion.div
            key={index}
            className="roadmap-item"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="roadmap-content section-card">
              <div className="roadmap-icon">{m.icon}</div>
              <div className="roadmap-header">
                <span className="roadmap-quarter">{m.quarter}</span>
                <h3>{m.title}</h3>
              </div>
              <p>{m.description}</p>
              <div className="roadmap-status">
                <span className="status-badge planned">En planification</span>
              </div>
            </div>
            <div className="roadmap-dot"></div>
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
          width: 4px;
          background: var(--primary-glow);
          transform: translateX(-50%);
          border-radius: 2px;
        }

        .roadmap-item {
          display: flex;
          justify-content: flex-end;
          padding-right: 50%;
          position: relative;
          margin-bottom: 50px;
          width: 100%;
        }

        .roadmap-item:nth-child(even) {
          justify-content: flex-start;
          padding-right: 0;
          padding-left: 50%;
        }

        .roadmap-content {
          width: 80%;
          margin: 0 40px;
          position: relative;
        }

        .roadmap-dot {
          position: absolute;
          right: -10px;
          top: 30px;
          width: 20px;
          height: 20px;
          background: var(--primary);
          border: 4px solid var(--bg-body);
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .roadmap-item:nth-child(even) .roadmap-dot {
          left: -10px;
        }

        .roadmap-header {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }

        .roadmap-quarter {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .roadmap-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .roadmap-status {
          margin-top: 15px;
        }

        @media (max-width: 768px) {
          .roadmap-timeline::before { left: 20px; }
          .roadmap-item { justify-content: flex-start; padding-left: 50px; padding-right: 0; }
          .roadmap-item:nth-child(even) { padding-left: 50px; }
          .roadmap-content { width: 100%; margin: 0; }
          .roadmap-dot { left: 10px !important; }
        }
      `}} />
    </div>
  );
};

export default RoadmapPage;
