import React from 'react';
import { Map, Zap, Smartphone, BarChart3, Globe } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Déploiement des terminaux physiques QR avec reconnaissance faciale optionnelle pour une sécurité accrue.',
      icon: <Zap size={24} />,
      status: 'planned'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés (self-service, notifications push, géolocalisation).',
      icon: <Smartphone size={24} />,
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration d\'algorithmes prédictifs pour anticiper l\'absentéisme et optimiser la planification des ressources.',
      icon: <BarChart3 size={24} />,
      status: 'planned'
    },
    { quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation financière en temps réel.',
      icon: <Globe size={24} />,
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Map className="text-primary" size={32} />
            <h1>Roadmap Futur</h1>
          </div>
          <p className="page-subtitle">Vision Stratégique & Évolutions Technologiques 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {milestones.map((ms, index) => (
          <div key={index} className="roadmap-item animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="roadmap-marker">
              <div className="roadmap-icon-wrapper">
                {ms.icon}
              </div>
              {index !== milestones.length - 1 && <div className="roadmap-line"></div>}
            </div>
            <div className="roadmap-content section-card">
              <div className="roadmap-header">
                <span className="roadmap-quarter">{ms.quarter}</span>
                <h3 className="roadmap-title">{ms.title}</h3>
              </div>
              <p className="roadmap-description">{ms.description}</p>
              <div className="roadmap-status">
                <span className="status-badge planned">Planifié</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: '40px', background: 'var(--primary-glow)', borderColor: 'var(--primary-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '40px' }}>🚀</div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>Objectif 2027 : Zéro Papier & IA Totale</h3>
            <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
              Transformer la gestion RH en un centre d'excellence prédictif et entièrement automatisé.
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .roadmap-timeline {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .roadmap-item {
          display: flex;
          gap: 30px;
        }
        .roadmap-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
        }
        .roadmap-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 15px var(--primary-glow);
        }
        .roadmap-line {
          width: 4px;
          background: var(--border);
          flex-grow: 1;
          margin: 5px 0;
        }
        .roadmap-content {
          flex: 1;
          margin-bottom: 30px;
          transition: transform 0.3s ease;
        }
        .roadmap-content:hover {
          transform: translateX(10px);
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
        .roadmap-title {
          margin: 0;
          font-size: 18px;
        }
        .roadmap-description {
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .status-badge.planned {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid var(--primary-light);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}} />
    </div>
  );
};

export default RoadmapPage;
