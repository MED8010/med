import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour le pointage mobile et la consultation des fiches de paie.',
      icon: '📱',
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration d\'algorithmes d\'intelligence artificielle pour prédire l\'absentéisme et optimiser la planification des congés.',
      icon: '🤖',
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo) pour une gestion financière unifiée.',
      icon: '🏢',
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Découvrez les prochaines étapes de l'évolution de votre plateforme RH</p>
        </div>
      </div>

      <div className="section-card" style={{ padding: '40px' }}>
        <div className="roadmap-timeline" style={{ position: 'relative' }}>
          {/* Vertical Line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'var(--primary-glow)',
            zIndex: 0
          }}></div>

          {milestones.map((milestone, index) => (
            <div key={index} className="roadmap-item animate-slide-in" style={{
              display: 'flex',
              gap: '30px',
              marginBottom: '40px',
              position: 'relative',
              zIndex: 1,
              animationDelay: `${index * 0.1}s`
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--grad-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: 'var(--shadow-primary)',
                flexShrink: 0
              }}>
                {milestone.icon}
              </div>

              <div className="kpi-card" style={{ flex: 1, margin: 0, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                  <span className="badge badge-primary" style={{ fontSize: '14px', padding: '6px 12px' }}>
                    {milestone.quarter}
                  </span>
                  <span className="badge badge-neutral">En planification</span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  {milestone.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '30px' }}>
        <div className="stats-box">
          <h3>💡 Suggestion de fonctionnalité</h3>
          <p className="text-muted" style={{ marginBottom: '20px' }}>
            Vous avez une idée pour améliorer la plateforme ? Soumettez votre suggestion à notre équipe produit.
          </p>
          <button className="btn-secondary">Proposer une idée</button>
        </div>
        <div className="stats-box">
          <h3>📢 Notes de mise à jour</h3>
          <p className="text-muted" style={{ marginBottom: '20px' }}>
            Consultez le journal des modifications pour voir les dernières fonctionnalités déployées.
          </p>
          <button className="btn-secondary">Voir le Changelog</button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
