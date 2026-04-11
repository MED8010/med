import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapData = [
    {
      quarter: 'Q2 2026',
      status: 'upcoming',
      features: [
        { title: 'IA - Analyse Prédictive', desc: 'Prédiction des absences et turnover basée sur l\'historique.' },
        { title: 'Application Mobile native', desc: 'Lancement des versions iOS et Android pour les employés.' },
        { title: 'E-learning intégré', desc: 'Plateforme de formation et suivi des compétences.' }
      ]
    },
    {
      quarter: 'Q3 2026',
      status: 'planned',
      features: [
        { title: 'Gestion des Carrières', desc: 'Outils de planification des promotions et successions.' },
        { title: 'Signature Électronique', desc: 'Intégration de signature légale pour les contrats et fiches de paie.' },
        { title: 'Chatbot RH 24/7', desc: 'Assistant virtuel pour répondre aux questions fréquentes des employés.' }
      ]
    },
    {
      quarter: 'Q4 2026',
      status: 'vision',
      features: [
        { title: 'Expansion Internationale', desc: 'Support multi-devises et multi-législations (Afrique & Europe).' },
        { title: 'Intégration ERP SAP/Oracle', desc: 'Synchronisation automatique avec les grands ERP du marché.' },
        { title: 'Dashboard BI Avancé', desc: 'Reporting personnalisé avec PowerBI/Tableau.' }
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions de la plateforme RH</p>
        </div>
        <div className="badge-primary badge" style={{ padding: '8px 16px' }}>Version 1.0.0 Stable</div>
      </div>

      <div className="roadmap-timeline">
        {roadmapData.map((period, idx) => (
          <div key={idx} className="section-card mb-6 animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '20px' }}>🚀 {period.quarter}</h2>
              <span className={`badge badge-${period.status === 'upcoming' ? 'success' : 'info'}`}>
                {period.status.toUpperCase()}
              </span>
            </div>

            <div className="grid-3">
              {period.features.map((feature, fIdx) => (
                <div key={fIdx} className="kpi-card" style={{ cursor: 'default' }}>
                  <div className="kpi-label" style={{ color: 'var(--primary)', marginBottom: 10 }}>{feature.title}</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="section-card mt-6" style={{ background: 'var(--primary-glow)', border: '1px dashed var(--primary)' }}>
        <h3 style={{ color: 'var(--primary)' }}>💡 Notre Vision</h3>
        <p style={{ margin: 0, fontSize: '15px' }}>
          Devenir la plateforme de référence pour la gestion du capital humain, en combinant
          <strong> Intelligence Artificielle</strong>, <strong>Simplicité d'utilisation</strong> et
          <strong> Haute Sécurité</strong>. Nous construisons l'avenir du travail, un module à la fois.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
