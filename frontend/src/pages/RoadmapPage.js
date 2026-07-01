import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'QR v2 System',
      description: 'Mise en place de badges QR dynamiques avec rotation de clé pour une sécurité accrue.',
      status: 'planned',
      icon: '🛡️'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des versions iOS et Android pour les employés et gestionnaires.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Utilisation du Machine Learning pour prédire les tendances d\'absentéisme et optimiser les plannings.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle).',
      status: 'planned',
      icon: '🔗'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Technologique & Évolutions 2026</p>
        </div>
      </div>

      <div className="section-card">
        <div className="roadmap-timeline" style={{ padding: '20px 0' }}>
          {milestones.map((milestone, index) => (
            <div key={index} className="milestone-item" style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '40px',
              position: 'relative'
            }}>
              <div className="milestone-date" style={{
                minWidth: '100px',
                fontWeight: '800',
                color: 'var(--primary)',
                fontSize: '1.2rem',
                paddingTop: '5px'
              }}>
                {milestone.quarter}
              </div>

              <div className="milestone-marker" style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '3px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  zIndex: 2
                }}>
                  {milestone.icon}
                </div>
                {index < milestones.length - 1 && (
                  <div style={{
                    width: '3px',
                    flex: 1,
                    background: 'linear-gradient(to bottom, var(--primary), var(--border))',
                    marginTop: '5px',
                    marginBottom: '-45px'
                  }}></div>
                )}
              </div>

              <div className="milestone-content" style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                flex: 1
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>{milestone.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>{milestone.description}</p>
                <div style={{
                  marginTop: '15px',
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Statut: Planifié
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '30px' }}>
        <div className="section-card">
          <h3>💡 Suggestion de Fonctionnalité</h3>
          <p>Vous avez une idée pour améliorer l'application ? Soumettez-la à l'équipe technique.</p>
          <textarea
            placeholder="Décrivez votre idée ici..."
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '12px',
              color: 'white',
              minHeight: '100px',
              marginBottom: '15px'
            }}
          ></textarea>
          <button className="btn-primary">Envoyer la suggestion</button>
        </div>

        <div className="section-card">
          <h3>🚀 Prochaine Mise à Jour</h3>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ fontSize: '30px' }}>📦</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>Version 1.5.0-beta</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Prévue pour Décembre 2025</div>
            </div>
          </div>
          <ul style={{ marginTop: '15px', color: 'var(--text-muted)', fontSize: '14px' }}>
            <li>Export Excel avancé des pointages</li>
            <li>Nouveau dashboard Chef de Service</li>
            <li>Optimisation des performances scanner</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
