import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push et géofencing pour le pointage.',
      status: 'planned',
      icon: '🚀'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytiques IA & Prédictions',
      description: 'Algorithmes prédictifs pour anticiper les besoins en recrutement et détecter les risques de burnout ou d\'absentéisme.',
      status: 'planned',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: '🏢 Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Sage) pour une gestion financière unifiée.',
      status: 'planned',
      icon: '🔗'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions à venir pour HR Manager</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ position: 'relative', padding: '20px 0' }}>
        <div style={{
            position: 'absolute', left: '31px', top: 0, bottom: 0,
            width: '2px', background: 'var(--primary-glow)', zIndex: 0
        }}></div>

        {milestones.map((m, index) => (
          <div key={index} className="roadmap-item animate-slide-in" style={{
              display: 'flex', gap: 30, marginBottom: 40, position: 'relative', zIndex: 1,
              animationDelay: `${index * 0.1}s`
          }}>
            <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--bg-card)', border: '4px solid var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', flexShrink: 0, boxShadow: 'var(--shadow-sm)'
            }}>
              {m.icon}
            </div>

            <div className="section-card" style={{ flex: 1, margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="badge badge-primary" style={{ fontSize: '12px', padding: '4px 12px' }}>{m.quarter}</span>
                <span className="badge badge-neutral">En planification</span>
              </div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', color: 'var(--text-primary)' }}>{m.title}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{m.description}</p>

              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                  <div style={{ height: '6px', flex: 1, background: 'var(--bg-hover)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: '15%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>15%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 20, background: 'var(--grad-primary)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ fontSize: '40px' }}>💡</div>
              <div>
                  <h3 style={{ color: 'white', margin: '0 0 5px 0' }}>Suggérer une fonctionnalité ?</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>Votre avis compte ! Contactez l'équipe produit pour nous faire part de vos besoins spécifiques.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
