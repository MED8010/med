import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapItems = [
    {
      quarter: 'Q1 2026',
      status: 'Terminé',
      features: [
        'Gestion complète des employés (CRUD)',
        'Système de pointage QR Code',
        'Gestion des congés et absences',
        'Calcul automatique des salaires',
        'Journal d\'audit et sécurité'
      ]
    },
    {
      quarter: 'Q2 2026',
      status: 'En cours',
      features: [
        'Mode automatique pour le scanner QR',
        'Tableaux de bord analytiques avancés',
        'Notifications temps réel (Socket.io)',
        'Exportation de rapports PDF/Excel personnalisés'
      ]
    },
    {
      quarter: 'Q3 2026',
      status: 'À venir',
      features: [
        'Application mobile native (iOS/Android)',
        'Gestion des formations et compétences',
        'Intégration Slack/Microsoft Teams',
        'Signature électronique des contrats'
      ]
    },
    {
      quarter: 'Q4 2026',
      status: 'Futur',
      features: [
        'Intelligence Artificielle pour la prédiction des départs',
        'Recrutement automatisé avec parsing de CV',
        'Portail candidat externe',
        'Gestion multi-sites internationale'
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision et évolution de la plateforme RH</p>
        </div>
      </div>

      <div className="form-sections-container">
        {roadmapItems.map((item, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s`, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h2 style={{ margin: 0, color: 'var(--primary)' }}>{item.quarter}</h2>
              <span className={`badge ${
                item.status === 'Terminé' ? 'badge-success' :
                item.status === 'En cours' ? 'badge-primary' : 'badge-neutral'
              }`}>
                {item.status}
              </span>
            </div>
            <ul style={{ paddingLeft: 20 }}>
              {item.features.map((feature, fIndex) => (
                <li key={fIndex} style={{ marginBottom: 8, color: 'var(--text-primary)' }}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
