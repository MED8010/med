import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Intégration de la reconnaissance faciale en complément du QR code pour une sécurité accrue.',
      icon: '🛡️',
      status: 'planned'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android avec notifications push temps réel.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Utilisation du Machine Learning pour prédire les besoins en recrutement et détecter les risques d\'absentéisme.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      icon: '🔌',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines évolutions 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ position: 'relative', padding: '20px 0' }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'var(--primary-glow)',
          transform: 'translateX(-50%)',
          zIndex: 0
        }}></div>

        {milestones.map((ms, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
            width: '100%',
            marginBottom: 40,
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '45%',
              background: 'var(--bg-card)',
              padding: 24,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 20,
                [index % 2 === 0 ? 'right' : 'left']: -10,
                width: 20,
                height: 20,
                background: 'var(--primary)',
                borderRadius: '50%',
                border: '4px solid var(--bg)',
                [index % 2 === 0 ? 'transform' : 'transform']: index % 2 === 0 ? 'translateX(50%)' : 'translateX(-50%)'
              }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{ms.icon}</span>
                <span style={{
                  background: 'var(--primary-glow)',
                  color: 'var(--primary)',
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {ms.quarter}
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{ms.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>{ms.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 40, textAlign: 'center' }}>
        <h3>🚀 Prêt pour le futur des RH ?</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Notre équipe travaille activement sur ces fonctionnalités pour transformer votre gestion du capital humain.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
