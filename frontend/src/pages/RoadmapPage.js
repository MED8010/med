import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2',
      description: 'Déploiement de la nouvelle génération de terminaux de pointage avec reconnaissance faciale optionnelle et synchronisation hors-ligne.',
      status: 'upcoming',
      icon: '🔐'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés : consultation des plannings, demandes de congés et notifications push en temps réel.',
      status: 'upcoming',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration d\'algorithmes prédictifs pour anticiper les besoins en ressources et détecter les tendances d\'absentéisme.',
      status: 'upcoming',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP et Oracle afin de synchroniser automatiquement les données RH et financières.',
      status: 'upcoming',
      icon: '🏢'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques 2026</p>
        </div>
      </div>

      <div className="section-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ position: 'relative', paddingLeft: '40px', borderLeft: '2px solid var(--primary-glow)' }}>
          {milestones.map((m, index) => (
            <div key={index} className="animate-slide-in" style={{ marginBottom: '40px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-52px',
                top: '0',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '4px solid var(--primary)',
                zIndex: 2
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <span className="badge badge-primary" style={{ padding: '4px 12px' }}>{m.quarter}</span>
                <span style={{ fontSize: '24px' }}>{m.icon}</span>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{m.title}</h2>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
