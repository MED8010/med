import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Intégration de la reconnaissance faciale en complément des QR codes pour une sécurité accrue.',
      status: 'planned',
      icon: '🛡️'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des versions iOS et Android pour les employés (self-service, notifications push).',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Module de prédiction de l\'absentéisme et optimisation automatique des plannings via IA.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      status: 'planned',
      icon: '🔄'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines évolutions du système</p>
        </div>
      </div>

      <div className="roadmap-container">
        <div className="roadmap-timeline">
          {milestones.map((m, index) => (
            <div key={index} className="roadmap-item animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="roadmap-date">
                <span className="quarter">{m.quarter}</span>
                <div className="dot"></div>
              </div>
              <div className="section-card roadmap-card">
                <div className="roadmap-icon">{m.icon}</div>
                <div className="roadmap-content">
                  <h3>{m.title}</h3>
                  <p>{m.description}</p>
                  <div className="roadmap-status">
                    <span className="badge badge-info">Prévu</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-card roadmap-vision">
          <h3>🚀 Notre Vision 2026</h3>
          <p>
            Devenir la plateforme de gestion RH de référence, alliant simplicité d'utilisation
            et puissance analytique. Nous nous concentrons sur l'automatisation des tâches
            administratives pour permettre aux RH de se focaliser sur l'humain.
          </p>
          <div className="vision-stats">
            <div className="v-stat">
              <span className="v-value">100%</span>
              <span className="v-label">Digital</span>
            </div>
            <div className="v-stat">
              <span className="v-value">0</span>
              <span className="v-label">Papier</span>
            </div>
            <div className="v-stat">
              <span className="v-value">IA</span>
              <span className="v-label">Native</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
