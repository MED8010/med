import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Sécurité',
      description: 'Lancement des codes QR dynamiques à expiration courte pour prévenir la fraude au pointage.',
      icon: '🔐',
      status: 'planned'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Déploiement sur iOS et Android avec notifications push en temps réel et géolocalisation optionnelle.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Algorithmes prédictifs pour anticiper les besoins en recrutement et détecter les risques d\'absentéisme.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux logiciels de comptabilité et de gestion de production.',
      icon: '🏢',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes du projet HR Manager</p>
        </div>
      </div>

      <div className="stats-box" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20 }}>🚀 Vers une gestion RH 4.0</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 800 }}>
          Notre mission est de digitaliser l'ensemble des processus RH pour offrir une expérience fluide,
          transparente et data-driven. Voici les jalons majeurs prévus pour l'année 2026.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {milestones.map((m, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ fontSize: 40 }}>{m.icon}</div>
              <span className="badge badge-primary" style={{ fontSize: 14, padding: '6px 12px' }}>{m.quarter}</span>
            </div>

            <h3 style={{ fontSize: 18, marginBottom: 12, color: 'var(--text-primary)' }}>{m.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>{m.description}</p>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--text-muted)' }}></div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>En planification</span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 32, background: 'var(--grad-primary)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 48 }}>💡</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>Vous avez une suggestion ?</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
              Nous construisons cet outil pour vous. N'hésitez pas à contacter l'équipe de développement
              pour partager vos idées d'amélioration.
            </p>
          </div>
          <button className="btn-primary" style={{ background: 'white', color: 'var(--primary)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
            Envoyer un Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
