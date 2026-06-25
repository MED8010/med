import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Déploiement de terminaux physiques dédiés et support de la reconnaissance faciale pour les zones de haute sécurité.',
      status: 'En cours',
      icon: '🛡️'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push et self-service RH.',
      status: 'Planifié',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les besoins en recrutement et détecter les risques de burnout.',
      status: 'Recherche',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle en temps réel avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      status: 'Planifié',
      icon: '🔌'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Vision et Évolutions de la Plateforme HR Manager</p>
        </div>
      </div>

      <div className="stats-box" style={{ marginBottom: 30 }}>
        <h3>🎯 Notre Vision</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          Nous construisons le futur de la gestion des ressources humaines. Notre objectif est de simplifier
          chaque aspect de la vie professionnelle des collaborateurs tout en fournissant aux administrateurs
          des outils de pilotage puissants et intuitifs basés sur la donnée.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 25 }}>
        {milestones.map((ms, index) => (
          <div key={index} className="section-card animate-slide-in" style={{
            display: 'flex',
            gap: 20,
            alignItems: 'center',
            borderLeft: `5px solid ${index === 0 ? 'var(--primary)' : 'var(--border)'}`
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 15,
              background: 'var(--primary-glow)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0
            }}>
              {ms.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{ms.quarter}</span>
                <span className={`badge ${ms.status === 'En cours' ? 'badge-info' : 'badge-neutral'}`}>
                  {ms.status}
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px 0' }}>{ms.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13.5 }}>{ms.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-box" style={{ marginTop: 40, textAlign: 'center', background: 'var(--grad-primary)', color: 'white' }}>
        <h2 style={{ color: 'white', marginBottom: 10 }}>💡 Vous avez une suggestion ?</h2>
        <p style={{ opacity: 0.9 }}>
          Notre roadmap est collaborative. Contactez l'équipe produit pour proposer de nouvelles fonctionnalités.
        </p>
        <button className="btn-secondary" style={{ marginTop: 15, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}>
          📢 Soumettre une idée
        </button>
      </div>
    </div>
  );
};

export default RoadmapPage;
