import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile',
      status: 'upcoming',
      features: [
        'Pointage par géolocalisation',
        'Notifications push en temps réel',
        'Consultation des bulletins de paie sur mobile',
        'Demandes de congés simplifiées'
      ]
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Intelligence Artificielle',
      status: 'planning',
      features: [
        'Prédiction de l\'absentéisme',
        'Analyse prédictive de la masse salariale',
        'Assistant RH conversationnel (Chatbot)',
        'Optimisation automatique des plannings'
      ]
    },
    {
      quarter: 'Q4 2026',
      title: '🏢 Intégration ERP & Comptabilité',
      status: 'future',
      features: [
        'Synchronisation avec SAP / Sage',
        'Exportation automatique vers la comptabilité',
        'Gestion multi-sites centralisée',
        'Portail fournisseur intégré'
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Vision et Prochaines Étapes du Projet</p>
        </div>
      </div>

      <div style={{ position: 'relative', padding: '20px 0' }}>
        <div style={{
          position: 'absolute',
          left: '20px',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'var(--primary-glow)',
          borderRadius: '2px'
        }}></div>

        {milestones.map((ms, index) => (
          <div key={index} className="animate-slide-in" style={{
            position: 'relative',
            paddingLeft: '60px',
            marginBottom: '40px',
            animationDelay: `${index * 0.1}s`
          }}>
            <div style={{
              position: 'absolute',
              left: '0',
              top: '0',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: ms.status === 'upcoming' ? 'var(--grad-primary)' :
                          ms.status === 'planning' ? 'var(--grad-info)' : 'var(--bg-hover)',
              border: '4px solid var(--bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: ms.status === 'future' ? 'var(--text-muted)' : 'white' }}>
                {index + 1}
              </span>
            </div>

            <div className="section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span className={`badge ${ms.status === 'upcoming' ? 'badge-primary' : 'badge-neutral'}`}>
                  {ms.quarter}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {ms.status.toUpperCase()}
                </span>
              </div>

              <h2 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>{ms.title}</h2>

              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {ms.features.map((f, fi) => (
                  <li key={fi} style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: '20px', background: 'var(--grad-primary)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '40px' }}>💡</div>
          <div>
            <h3 style={{ color: 'white', margin: '0 0 5px 0' }}>Suggérer une fonctionnalité ?</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Nous sommes à l'écoute de vos besoins pour améliorer continuellement votre outil de gestion RH.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
