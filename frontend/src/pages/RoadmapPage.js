import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Optimisation de la Performance',
      description: 'Refonte complète de l\'architecture de données pour supporter plus de 50,000 employés avec une latence < 100ms.',
      status: 'planned',
      icon: '🚀'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android avec notifications push et mode hors-ligne pour les sites distants.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur de prédiction d\'absentéisme et suggestions intelligentes pour l\'optimisation des plannings.',
      status: 'planned',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle en temps réel avec SAP, Oracle et Microsoft Dynamics.',
      status: 'planned',
      icon: '🏢'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et développements à venir pour 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ position: 'relative', padding: '20px 0' }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'var(--primary-glow)',
          transform: 'translateX(-50%)',
          borderRadius: '2px'
        }}></div>

        {milestones.map((m, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
            padding: '20px 0',
            position: 'relative',
            width: '100%'
          }}>
            <div style={{
              width: '45%',
              background: 'var(--bg-card)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                [index % 2 === 0 ? 'right' : 'left']: '-12px',
                transform: 'translateY(-50%) rotate(45deg)',
                width: '24px',
                height: '24px',
                background: 'var(--bg-card)',
                borderRight: index % 2 === 0 ? '1px solid var(--border)' : 'none',
                borderTop: index % 2 === 0 ? '1px solid var(--border)' : 'none',
                borderLeft: index % 2 !== 0 ? '1px solid var(--border)' : 'none',
                borderBottom: index % 2 !== 0 ? '1px solid var(--border)' : 'none',
              }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>{m.icon}</span>
                <span className="badge badge-primary">{m.quarter}</span>
              </div>
              <h3 style={{ marginBottom: '8px', color: 'var(--primary)' }}>{m.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                {m.description}
              </p>
            </div>

            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '20px',
              height: '20px',
              background: 'var(--primary)',
              border: '4px solid var(--bg)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              boxShadow: '0 0 0 4px var(--primary-glow)'
            }}></div>
          </div>
        ))}
      </div>

      <div className="section-card mt-6" style={{ textAlign: 'center', background: 'var(--grad-primary)', color: 'white', border: 'none' }}>
        <h2 style={{ color: 'white' }}>Une Vision à Long Terme</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
          Notre engagement est de fournir la solution de gestion RH la plus avancée du marché,
          alliant intelligence artificielle, ergonomie et connectivité totale pour propulser votre entreprise
          dans l'ère de l'industrie 4.0.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
