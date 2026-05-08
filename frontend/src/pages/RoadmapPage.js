import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour le pointage mobile et la gestion des congés en déplacement.',
      icon: '📱',
      status: 'planned',
      features: ['Géofencing pour le pointage', 'Notifications Push', 'Mode hors ligne']
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration de modèles d\'intelligence artificielle pour prédire l\'absentéisme et optimiser la planification.',
      icon: '🤖',
      status: 'planned',
      features: ['Prédiction d\'absentéisme', 'Optimisation des plannings', 'Analyses de tendances']
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      icon: '🏢',
      status: 'planned',
      features: ['API Unifiée', 'Exports comptables automatisés', 'Gestion multi-filiales']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques de la plateforme RH</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '900px' }}>
        {milestones.map((m, index) => (
          <div key={index} className="section-card animate-slide-in" style={{
            display: 'flex',
            gap: '24px',
            position: 'relative',
            padding: '32px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--primary-glow)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)'
            }}>
              {m.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge badge-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>{m.quarter}</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>{m.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '15px' }}>{m.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {m.features.map((f, fi) => (
                  <span key={fi} style={{
                    fontSize: '12px',
                    background: 'var(--bg-hover)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)'
                  }}>
                    ✨ {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: '40px', background: 'var(--grad-primary)', color: 'white', border: 'none' }}>
        <h3 style={{ color: 'white' }}>🚀 Votre vision compte</h3>
        <p>Nous construisons l'avenir des RH avec vous. Si vous avez des suggestions de fonctionnalités, n'hésitez pas à contacter notre équipe produit.</p>
      </div>
    </div>
  );
};

export default RoadmapPage;
