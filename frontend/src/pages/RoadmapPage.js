import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const { user } = useAuth();

  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Authentification Biométrique',
      description: 'Lancement du nouveau protocole de scan sécurisé avec support de l\'authentification faciale pour les zones sensibles.',
      status: 'planned',
      icon: '🔐'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native (iOS & Android)',
      description: 'Déploiement des applications natives pour permettre aux employés de gérer leurs congés et consulter leurs bulletins de paie en mobilité.',
      status: 'upcoming',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions de Turnover',
      description: 'Intégration de modèles d\'intelligence artificielle pour prédire les risques de démission et optimiser la planification des effectifs.',
      status: 'upcoming',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale & Workflow Automatisé',
      description: 'Connexion directe avec les principaux ERP du marché et automatisation complète des flux RH complexes.',
      status: 'upcoming',
      icon: '🌐'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Stratégique & Prochaines Étapes de Développement</p>
        </div>
      </div>

      <div className="roadmap-grid" style={{
        display: 'grid',
        gap: '30px',
        position: 'relative',
        padding: '20px 0'
      }}>
        {/* Vertical line for the timeline */}
        <div className="timeline-line" style={{
          position: 'absolute',
          left: '40px',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'var(--grad-primary)',
          borderRadius: '2px',
          opacity: 0.3
        }} />

        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="roadmap-item animate-slide-in"
            style={{
              display: 'flex',
              gap: '30px',
              position: 'relative',
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Quarter bubble */}
            <div className="quarter-bubble" style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '4px solid var(--primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              flexShrink: 0,
              boxShadow: 'var(--shadow)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)' }}>{milestone.quarter.split(' ')[0]}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>{milestone.quarter.split(' ')[1]}</span>
            </div>

            {/* Content card */}
            <div className="section-card" style={{
              flex: 1,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>{milestone.icon}</span>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>{milestone.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {milestone.description}
              </p>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <span className={`badge badge-${milestone.status === 'planned' ? 'primary' : 'info'}`}>
                  {milestone.status === 'planned' ? 'En Planification' : 'À Venir'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: '40px', background: 'var(--grad-primary)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '40px' }}>💡</div>
          <div>
            <h2 style={{ color: 'white', margin: '0 0 8px 0' }}>Suggérer une fonctionnalité ?</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Nous construisons l'avenir de HR Manager avec vous. Si vous avez des besoins spécifiques,
              n'hésitez pas à contacter l'équipe produit ou votre administrateur système.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
