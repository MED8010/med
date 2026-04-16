import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Optimisation Infrastructure',
      status: 'upcoming',
      features: ['Migration Cloud Multi-Région', 'Nouveau Système de Cache', 'Dashboard Temps Réel v2']
    },
    {
      quarter: 'Q2 2026',
      title: 'Expansion Mobile App',
      status: 'planned',
      features: ['Application iOS Native', 'Application Android Native', 'Mode Hors-ligne QR Scan', 'Notifications Push Biométriques']
    },
    {
      quarter: 'Q3 2026',
      title: 'Intelligence Artificielle & Analytics',
      status: 'planned',
      features: ['Prédiction d\'Absentéisme (IA)', 'Optimisation Auto des Plannings', 'Analyse Sentimentale des Employés', 'Rapports RH Génératifs']
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP & Écosystème',
      status: 'planned',
      features: ['Connecteur SAP & Oracle', 'API Publique pour Partenaires', 'Module de Paie Multi-Devises', 'Gestion de Carrière & Formations']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Technologique & Évolutions 2026</p>
        </div>
        <div className="badge badge-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
          🚀 Version 3.0.0 Alpha
        </div>
      </div>

      <div className="roadmap-timeline" style={{ marginTop: '40px' }}>
        {milestones.map((m, idx) => (
          <div key={idx} className="section-card animate-slide-in" style={{ marginBottom: '30px', borderLeft: '5px solid var(--primary)', animationDelay: `${idx * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                {m.quarter}
              </span>
              <span className={`badge ${m.status === 'upcoming' ? 'badge-info' : 'badge-neutral'}`}>
                {m.status.toUpperCase()}
              </span>
            </div>
            <h2 style={{ fontSize: '20px', margin: '0 0 15px 0' }}>{m.title}</h2>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              {m.features.map((f, fi) => (
                <li key={fi} style={{ marginBottom: '8px' }}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ background: 'var(--grad-primary)', color: 'white', textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: 'white' }}>Vous avez des suggestions ?</h2>
        <p style={{ opacity: 0.9, marginBottom: '24px' }}>Notre roadmap est construite avec nos utilisateurs. Contactez l'équipe produit pour proposer une fonctionnalité.</p>
        <button className="btn-secondary" style={{ background: 'white', color: 'var(--primary)', border: 'none' }}>
          📧 Envoyer un feedback
        </button>
      </div>
    </div>
  );
};

export default RoadmapPage;
