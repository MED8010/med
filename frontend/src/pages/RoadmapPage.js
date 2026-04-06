import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapItems = [
    {
      quarter: 'Q2 2026',
      title: 'Phase 1: Automatisation & IA',
      status: 'upcoming',
      features: [
        'Analyse prédictive de l\'absentéisme par IA',
        'Génération automatique de plannings optimisés',
        'Intégration d\'un chatbot RH pour les questions des employés',
        'Reconnaissance faciale pour le pointage (Optionnel)'
      ]
    },
    {
      quarter: 'Q3 2026',
      title: 'Phase 2: Écosystème Mobile',
      status: 'planned',
      features: [
        'Application mobile native (iOS & Android)',
        'Notifications push en temps réel',
        'Géofencing pour le pointage sur site distant',
        'Signature électronique des contrats'
      ]
    },
    {
      quarter: 'Q4 2026',
      title: 'Phase 3: Extension Finance & Talent',
      status: 'planned',
      features: [
        'Module complet de gestion de carrière & formations',
        'Intégration comptable directe (Sage, SAP, QuickBooks)',
        'Gestion avancée des frais de déplacement',
        'Système d\'évaluation 360 degrés'
      ]
    },
    {
      quarter: '2027',
      title: 'Vision Long Terme',
      status: 'vision',
      features: [
        'Expansion multi-entreprise (SaaS)',
        'Support multilingue étendu (Arabe, Français, Anglais)',
        'Module de recrutement avec matching IA des CVs',
        'Tableaux de bord stratégiques pour la direction'
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines évolutions de la plateforme</p>
        </div>
      </div>

      <div className="stats-box mb-6">
        <p>
          Notre mission est de transformer la gestion des ressources humaines par l'innovation technologique.
          Voici les jalons prévus pour les mois à venir.
        </p>
      </div>

      <div className="roadmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {roadmapItems.map((item, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ borderTop: `4px solid ${item.status === 'upcoming' ? 'var(--primary)' : 'var(--border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-primary">{item.quarter}</span>
              {item.status === 'upcoming' && <span className="badge badge-success">Priorité</span>}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>{item.title}</h2>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              {item.features.map((feature, fIndex) => (
                <li key={fIndex} style={{ marginBottom: '8px' }}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="section-card mt-6" style={{ background: 'var(--grad-primary)', color: 'white' }}>
        <h3 style={{ color: 'white' }}>🚀 Votre avis compte</h3>
        <p>
          Cette roadmap est évolutive. Si vous avez des besoins spécifiques ou des suggestions d'amélioration,
          n'hésitez pas à contacter l'équipe de développement.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
