import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Optimisation de l\'Infrastructure',
      status: 'upcoming',
      icon: '🚀',
      description: 'Mise à niveau vers une architecture micro-services pour supporter la charge croissante.',
      features: ['Migration Cloud AWS', 'Base de données distribuée', 'Nouveaux protocoles de sécurité']
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      status: 'planned',
      icon: '📱',
      description: 'Lancement des applications iOS et Android pour les employés et gestionnaires.',
      features: ['Notifications Push', 'Self-service hors-ligne', 'Géofencing pour le pointage']
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      status: 'vision',
      icon: '🤖',
      description: 'Intégration de modèles prédictifs pour optimiser la gestion des ressources humaines.',
      features: ['Prévision de l\'absentéisme', 'Analyse du climat social', 'Recommandations de recrutement']
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      status: 'vision',
      icon: '🏢',
      description: 'Connexion bidirectionnelle avec les principaux ERP du marché.',
      features: ['Synchronisation SAP/Oracle', 'Comptabilité automatisée', 'Portail partenaires']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur 2026</h1>
          <p className="page-subtitle">Notre Vision pour l'Excellence RH</p>
        </div>
        <div className="badge badge-primary" style={{ padding: '8px 16px', borderRadius: '12px' }}>
          Version 2.0 en préparation
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 40, paddingBottom: 60 }}>
        {/* Timeline Line */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 4, background: 'var(--primary-glow)',
          transform: 'translateX(-50%)', borderRadius: 2,
          zIndex: 0
        }} className="hide-mobile"></div>

        <div className="roadmap-grid" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {milestones.map((ms, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
              position: 'relative',
              width: '100%'
            }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: '50%', top: 20,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--primary)', border: '4px solid var(--bg)',
                transform: 'translateX(-50%)', zIndex: 2,
                boxShadow: 'var(--shadow-primary)'
              }} className="hide-mobile"></div>

              <div className="section-card animate-slide-in" style={{
                width: '45%',
                padding: 30,
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: 'var(--primary)',
                    background: 'var(--primary-glow)', padding: '4px 12px', borderRadius: 20
                  }}>
                    {ms.quarter}
                  </span>
                  <span style={{ fontSize: 24 }}>{ms.icon}</span>
                </div>

                <h2 style={{ marginBottom: 10, fontSize: 20, fontWeight: 800 }}>{ms.title}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
                  {ms.description}
                </p>

                <div style={{ background: 'var(--bg-hover)', borderRadius: 12, padding: 20 }}>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                    Fonctionnalités Clés
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {ms.features.map((feat, fi) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <span style={{ color: 'var(--success)' }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hide-mobile {
            display: none !important;
          }
          .section-card {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;
