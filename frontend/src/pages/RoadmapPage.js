import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapItems = [
    {
      phase: 'Phase 1 : Fondations & Core HR',
      status: 'Terminé',
      date: 'Q1 2026',
      color: 'var(--success)',
      features: [
        'Gestion complète des employés (CRUD)',
        'Système d\'authentification sécurisé JWT',
        'Gestion des Services et UAP',
        'Suivi des présences et retards',
        'Calcul automatique de la paie'
      ]
    },
    {
      phase: 'Phase 2 : Optimisation & Mobilité',
      status: 'En cours',
      date: 'Q2 2026',
      color: 'var(--primary)',
      features: [
        'Scanner QR Code Haute Précision avec Mode Auto',
        'Application Mobile (Android/iOS)',
        'Notifications Push en temps réel',
        'Exportation de rapports PDF/Excel avancés',
        'Refonte de l\'interface utilisateur (Dark Mode)'
      ]
    },
    {
      phase: 'Phase 3 : Intelligence Artificielle',
      status: 'À venir',
      date: 'Q3 2026',
      color: 'var(--secondary)',
      features: [
        'Prédiction de l\'absentéisme par IA',
        'Optimisation automatique des plannings',
        'Chatbot RH pour les employés',
        'Analyse prédictive de la masse salariale',
        'Intégration biométrique (Empreintes/Facial)'
      ]
    },
    {
      phase: 'Phase 4 : Écosystème Global',
      status: 'Planifié',
      date: 'Q4 2026',
      color: 'var(--warning)',
      features: [
        'Module de recrutement et ATS',
        'Gestion de la formation et des compétences',
        'Évaluation de la performance (360°)',
        'Portail self-service complet',
        'API publique pour intégrations tierces'
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolution de la plateforme RH</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ marginTop: 40 }}>
        {roadmapItems.map((item, index) => (
          <div key={index} className="section-card animate-slide-in" style={{
            marginBottom: 30,
            borderLeft: `6px solid ${item.color}`,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: item.color }}>{item.phase}</h2>
              <span className="badge" style={{ background: `${item.color}22`, color: item.color }}>
                {item.status} — {item.date}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
              {item.features.map((feature, fIndex) => (
                <div key={fIndex} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: item.color }}>✔</span>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ background: 'var(--grad-primary)', color: 'white', textAlign: 'center', padding: 40 }}>
        <h2 style={{ color: 'white' }}>Vous avez une idée ?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '10px auto 20px' }}>
          Notre plateforme évolue grâce à vos retours. N'hésitez pas à nous soumettre vos suggestions pour les futures versions.
        </p>
        <button className="btn-secondary" style={{ border: 'none', background: 'white', color: 'var(--primary)' }}>
          Soumettre une suggestion
        </button>
      </div>
    </div>
  );
};

export default RoadmapPage;
