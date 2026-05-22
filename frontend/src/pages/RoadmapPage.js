import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour une gestion en mobilité totale, incluant les notifications push et le self-service employé hors-ligne.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Mise en œuvre de modèles d\'intelligence artificielle pour prédire les tendances d\'absentéisme, optimiser les plannings et suggérer des augmentations basées sur la performance.',
      status: 'planned',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour les principaux ERP du marché (SAP, Oracle, Microsoft Dynamics) pour une synchronisation bidirectionnelle parfaite des données financières et RH.',
      status: 'planned',
      icon: '🔄'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Stratégique & Évolutions Majeures 2026</p>
        </div>
      </div>

      <div className="section-card animate-slide-in">
        <div className="roadmap-timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="roadmap-item" style={{
              display: 'flex',
              gap: '24px',
              marginBottom: index === milestones.length - 1 ? 0 : '40px',
              position: 'relative'
            }}>
              {index !== milestones.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '30px',
                  top: '60px',
                  bottom: '-20px',
                  width: '2px',
                  background: 'var(--primary-glow)',
                  zIndex: 0
                }}></div>
              )}

              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0,
                zIndex: 1,
                boxShadow: 'var(--shadow-sm)'
              }}>
                {milestone.icon}
              </div>

              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span className="badge badge-primary" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {milestone.quarter}
                  </span>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>{milestone.title}</h2>
                </div>
                <p style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  maxWidth: '800px'
                }}>
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2 mt-6">
        <div className="kpi-card kpi-info">
          <div className="kpi-card-top">
            <div className="kpi-icon-box">🎯</div>
          </div>
          <div className="kpi-label">Objectif Global</div>
          <div className="kpi-value">Digitalisation 100%</div>
          <p className="kpi-subtitle">Zéro papier d'ici fin 2026</p>
        </div>
        <div className="kpi-card kpi-purple">
          <div className="kpi-card-top">
            <div className="kpi-icon-box">🚀</div>
          </div>
          <div className="kpi-label">Innovation</div>
          <div className="kpi-value">Continuum</div>
          <p className="kpi-subtitle">Mises à jour mensuelles garanties</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
