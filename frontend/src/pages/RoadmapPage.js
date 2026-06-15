import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2',
      description: 'Déploiement de la nouvelle génération de bornes QR avec reconnaissance faciale optionnelle et intégration biométrique.',
      status: 'planned',
      icon: '🎫'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés (demandes de congés, consultation fiches de paie, notifications push).',
      status: 'upcoming',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Mise en place d\'algorithmes prédictifs pour l\'absentéisme et optimisation de la planification des ressources humaines.',
      status: 'upcoming',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connectivité bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Sage) pour une synchronisation comptable temps réel.',
      status: 'upcoming',
      icon: '🔌'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur 2026</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques de HR Manager</p>
        </div>
      </div>

      <div className="section-card" style={{ padding: '40px' }}>
        <div className="roadmap-timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="roadmap-item" style={{
              display: 'flex',
              gap: '30px',
              marginBottom: index === milestones.length - 1 ? 0 : '40px',
              position: 'relative'
            }}>
              {index !== milestones.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '30px',
                  top: '60px',
                  bottom: '-40px',
                  width: '2px',
                  background: 'var(--border)',
                  zIndex: 0
                }}></div>
              )}

              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: milestone.status === 'planned' ? 'var(--grad-primary)' : 'var(--bg-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                zIndex: 1,
                boxShadow: milestone.status === 'planned' ? 'var(--shadow-primary)' : 'none',
                flexShrink: 0
              }}>
                {milestone.icon}
              </div>

              <div style={{ flex: 1, paddingTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '12px' }}>{milestone.quarter}</span>
                  <span className={`badge ${milestone.status === 'planned' ? 'badge-success' : 'badge-neutral'}`}>
                    {milestone.status === 'planned' ? 'En Développement' : 'À venir'}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{milestone.title}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '30px' }}>
        <div className="section-card">
          <h3>🚀 Prochaines Étapes</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Notre équipe travaille actuellement sur la version 2.0 du système de pointage.
            L'objectif est d'atteindre une précision de 100% et de réduire le temps de traitement administratif de 40%.
          </p>
        </div>
        <div className="section-card">
          <h3>💡 Votre Feedback</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Toutes ces fonctionnalités sont pensées pour vous. N'hésitez pas à contacter l'équipe technique
            pour suggérer des améliorations ou de nouvelles fonctionnalités.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
