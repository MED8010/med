import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2',
      description: 'Détection faciale optionnelle et badges dynamiques haute sécurité.',
      icon: '🛡️',
      status: 'upcoming'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des versions iOS et Android avec notifications push temps réel.',
      icon: '📱',
      status: 'upcoming'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Prédiction de l\'absentéisme et optimisation automatique des plannings via IA.',
      icon: '🤖',
      status: 'upcoming'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec SAP, Oracle et Microsoft Dynamics.',
      icon: '🔌',
      status: 'upcoming'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Technologique & Évolutions 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ position: 'relative', padding: '40px 0' }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'linear-gradient(to bottom, var(--primary), var(--secondary))',
          transform: 'translateX(-50%)',
          borderRadius: '2px',
          opacity: 0.3
        }} className="timeline-line"></div>

        {milestones.map((ms, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
            padding: '20px 0',
            width: '100%',
            position: 'relative'
          }}>
            <div style={{
              width: '45%',
              background: 'var(--bg-card)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative'
            }} className="animate-fade-in">
              <div style={{
                position: 'absolute',
                top: '50%',
                [index % 2 === 0 ? 'right' : 'left']: '-50px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                zIndex: 2,
                transform: 'translateY(-50%)'
              }}>
                {ms.icon}
              </div>

              <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                {ms.quarter}
              </div>
              <h3 style={{ margin: '0 0 12px 0' }}>{ms.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {ms.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Prêt pour le futur des RH ?</h2>
        <p>Notre équipe travaille sans relâche pour apporter ces innovations à votre quotidien.</p>
        <div style={{ marginTop: '20px', display: 'inline-block', padding: '8px 16px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '20px', fontWeight: 'bold' }}>
          Version 2.0.0-beta prévue en Décembre 2025
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
