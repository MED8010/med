import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      status: 'planned',
      description: 'Lancement de l\'application iOS et Android pour les employés.',
      features: ['Notifications push', 'Pointage GPS', 'Demandes de congés mobiles']
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytiques IA & Prédictions',
      status: 'planned',
      description: 'Intégration de l\'intelligence artificielle pour prédire les besoins en RH.',
      features: ['Prédiction de l\'absentéisme', 'Optimisation des plannings', 'Analyses de performance IA']
    },
    {
      quarter: 'Q4 2026',
      title: '🌐 Intégration ERP Totale',
      status: 'planned',
      description: 'Connexion complète avec les systèmes SAP et Oracle.',
      features: ['Synchronisation financière', 'Gestion de stock intégrée', 'Portail fournisseur']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions de la plateforme 2026</p>
        </div>
      </div>

      <div className="form-sections-container">
        <div className="stats-box" style={{ marginBottom: '30px', background: 'var(--grad-primary)', color: 'white' }}>
          <h2 style={{ color: 'white' }}>Notre Vision 2026</h2>
          <p>
            Nous transformons la gestion des ressources humaines avec des outils innovants,
            mobiles et intelligents pour accompagner la croissance de votre entreprise.
          </p>
        </div>

        <div className="roadmap-timeline">
          {milestones.map((m, index) => (
            <div key={index} className="section-card animate-slide-in" style={{ marginBottom: '20px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '14px' }}>{m.quarter}</span>
                <span className="badge badge-neutral">Planifié</span>
              </div>
              <h2 style={{ fontSize: '20px', margin: '10px 0' }}>{m.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>{m.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {m.features.map((f, fi) => (
                  <span key={fi} style={{
                    padding: '4px 10px',
                    background: 'var(--bg-hover)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    border: '1px solid var(--border)'
                  }}>
                    ✨ {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
