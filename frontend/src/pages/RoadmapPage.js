import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Sécurité Avancée',
      description: 'Déploiement de QR codes dynamiques à expiration rapide pour prévenir la fraude et intégration de la biométrie faciale optionnelle.',
      status: 'planned',
      icon: '🔐'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native (iOS & Android)',
      description: 'Lancement de l\'application mobile pour les employés avec notifications push, géolocalisation pour le télétravail et accès hors-ligne.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les tendances d\'absentéisme et optimiser la planification des ressources humaines.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation en temps réel de la paie et des ressources.',
      status: 'planned',
      icon: '🏢'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Stratégique & Prochaines Évolutions 2026</p>
        </div>
      </div>

      <div className="section-card" style={{ marginTop: '20px' }}>
        <div className="timeline-container" style={{ position: 'relative', padding: '20px 0' }}>
          <div className="timeline-line" style={{
            position: 'absolute',
            left: '30px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'var(--primary-glow)',
            zIndex: 0
          }}></div>

          {milestones.map((milestone, index) => (
            <div key={index} className="timeline-item animate-slide-in" style={{
              display: 'flex',
              gap: '30px',
              marginBottom: '40px',
              position: 'relative',
              zIndex: 1,
              animationDelay: `${index * 0.1}s`
            }}>
              <div className="timeline-icon" style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
                boxShadow: 'var(--shadow-sm)'
              }}>
                {milestone.icon}
              </div>

              <div className="timeline-content" style={{
                background: 'var(--bg-hover)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                flex: 1,
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className="badge badge-primary">{milestone.quarter}</span>
                  <span className="badge badge-neutral">Planifié</span>
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--primary)' }}>{milestone.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '30px' }}>
        <div className="kpi-card kpi-info">
          <div className="kpi-card-top">
            <div className="kpi-icon-box">💡</div>
          </div>
          <h3 className="kpi-label">Innovation Continue</h3>
          <p className="kpi-subtitle">Nous écoutons vos retours pour construire l'outil RH de demain.</p>
        </div>
        <div className="kpi-card kpi-purple">
          <div className="kpi-card-top">
            <div className="kpi-icon-box">🚀</div>
          </div>
          <h3 className="kpi-label">Vitesse de Déploiement</h3>
          <p className="kpi-subtitle">Mises à jour mensuelles pour une expérience toujours optimale.</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
