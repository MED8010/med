import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      date: 'T1 2026',
      title: 'Phase de Lancement Mobile',
      description: 'Développement de l\'application mobile native (iOS & Android) pour les employés.',
      icon: '📱'
    },
    {
      date: 'T2 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration de modèles d\'IA pour prédire l\'absentéisme et optimiser les plannings.',
      icon: '🤖'
    },
    {
      date: 'T3 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs avec SAP, Oracle et Microsoft Dynamics.',
      icon: '🏢'
    },
    {
      date: 'T4 2026',
      title: 'Expansion Internationale',
      description: 'Support multi-devises et adaptation aux législations du travail européennes.',
      icon: '🌍'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes de développement</p>
        </div>
      </div>

      <div className="section-card">
        <div className="roadmap-timeline">
          {milestones.map((m, index) => (
            <div key={index} className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-content">
                <span className="roadmap-date">{m.date}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{m.icon}</span>
                  <h3 style={{ margin: 0 }}>{m.title}</h3>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 30 }}>
         <div className="kpi-card kpi-primary">
            <h3>🚀 Objectif 2026</h3>
            <p>Devenir la plateforme RH de référence pour la gestion hybride du temps de travail.</p>
         </div>
         <div className="kpi-card kpi-success">
            <h3>📈 Statut Actuel</h3>
            <p>Version 2.0 Stable - Déploiement du module Scanner QR terminé.</p>
         </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
