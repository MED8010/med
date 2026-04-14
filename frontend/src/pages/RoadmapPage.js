import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Phase d\'Expansion',
      items: [
        'Application Mobile (iOS & Android)',
        'Système de Notifications Push',
        'Gestion des Formations & Compétences'
      ],
      status: 'upcoming'
    },
    {
      quarter: 'Q3 2026',
      title: 'Intelligence RH',
      items: [
        'Analyses Prédictives des Départs',
        'Optimisation de la Paie via IA',
        'Tableaux de Bord Personnalisables'
      ],
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Écosystème Connecté',
      items: [
        'Intégration ERP & Comptabilité',
        'Portail Candidat & Recrutement',
        'Signature Électronique des Contrats'
      ],
      status: 'planned'
    },
    {
      quarter: '2027',
      title: 'Vision Futuriste',
      items: [
        'Gestion Multinationale & Multi-devises',
        'Module de Bien-être au Travail',
        'Gamification de la Performance'
      ],
      status: 'vision'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision et Prochaines Étapes du Projet</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {milestones.map((m, index) => (
          <div key={index} className={`roadmap-item ${m.status}`}>
            <div className="roadmap-marker">
              <div className="marker-dot"></div>
              <div className="marker-line"></div>
            </div>

            <div className="roadmap-content section-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="roadmap-header">
                <span className="roadmap-quarter">{m.quarter}</span>
                <span className={`roadmap-status-badge ${m.status}`}>
                  {m.status === 'upcoming' ? 'Prochainement' : (m.status === 'planned' ? 'Planifié' : 'Vision')}
                </span>
              </div>
              <h3>{m.title}</h3>
              <ul className="roadmap-list">
                {m.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card mt-6">
        <h3>🚀 Notre Engagement</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Nous nous efforçons d'innover continuellement pour offrir la meilleure expérience de gestion RH.
          Cette roadmap est indicative et évolue en fonction des besoins de nos utilisateurs et des avancées technologiques.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
