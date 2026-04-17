import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push et pointage GPS.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytique IA Prédictive',
      description: 'Intégration de modèles d\'IA pour prédire l\'absentéisme et optimiser la planification des effectifs.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Sage).',
      status: 'planned',
      icon: '🔄'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes du projet 2026</p>
        </div>
      </div>

      <div className="section-card animate-slide-in">
        <div className="roadmap-timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="roadmap-item" style={{
              display: 'flex',
              gap: '30px',
              marginBottom: '40px',
              position: 'relative'
            }}>
              <div className="roadmap-left" style={{
                minWidth: '100px',
                textAlign: 'right',
                paddingTop: '5px'
              }}>
                <span className="badge badge-primary" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  {milestone.quarter}
                </span>
              </div>

              <div className="roadmap-center" style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="roadmap-node" style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  zIndex: 2,
                  boxShadow: 'var(--shadow-primary)'
                }}>
                  {milestone.icon}
                </div>
                {index !== milestones.length - 1 && (
                  <div className="roadmap-line" style={{
                    width: '3px',
                    height: 'calc(100% + 40px)',
                    background: 'var(--border)',
                    position: 'absolute',
                    top: '50px',
                    zIndex: 1
                  }}></div>
                )}
              </div>

              <div className="roadmap-right" style={{
                background: 'var(--bg-hover)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                flex: 1,
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--text-primary)' }}>
                  {milestone.title}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2 mt-6">
        <div className="stats-box">
          <h3>🎯 Objectif 2026</h3>
          <p>Devenir la solution RH de référence pour les PME industrielles en intégrant des technologies de pointe pour simplifier la gestion humaine.</p>
        </div>
        <div className="stats-box">
          <h3>🚀 Innovation Continue</h3>
          <p>Nous travaillons chaque jour pour améliorer l'expérience utilisateur et ajouter des fonctionnalités demandées par notre communauté.</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
