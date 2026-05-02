import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push en temps réel et géofencing pour les pointages.',
      status: 'planned',
      features: ['Self-service mobile', 'Justificatifs via photo', 'Notifications temps réel']
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytiques IA & Prédictions',
      description: 'Intégration d\'algorithmes d\'intelligence artificielle pour prédire l\'absentéisme et optimiser la planification des ressources.',
      status: 'planned',
      features: ['Prédiction turn-over', 'Optimisation plannings', 'Analyses de tendances']
    },
    {
      quarter: 'Q4 2026',
      title: '🔗 Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation bidirectionnelle des données financières.',
      status: 'planned',
      features: ['Export comptable auto', 'Synchro référentiels', 'API publique sécurisée']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision et Évolution de la Plateforme RH</p>
        </div>
      </div>

      <div className="stats-box" style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: 18 }}>🎯 Notre Vision</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Nous construisons l'avenir de la gestion des ressources humaines. Notre objectif est de transformer les processus administratifs
          en leviers de performance stratégique grâce à l'innovation technologique constante.
        </p>
      </div>

      <div className="roadmap-timeline" style={{ position: 'relative', padding: '20px 0' }}>
        <div style={{
          position: 'absolute', left: '20px', top: 0, bottom: 0,
          width: '2px', background: 'var(--primary-glow)', zIndex: 0
        }} />

        {milestones.map((ms, index) => (
          <div key={index} className="animate-slide-in" style={{
            display: 'flex', gap: 30, marginBottom: 40, position: 'relative', zIndex: 1,
            animationDelay: `${index * 0.1}s`
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%', background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              fontWeight: 'bold', fontSize: 12, boxShadow: 'var(--shadow-primary)', flexShrink: 0
            }}>
              {ms.quarter}
            </div>

            <div className="section-card" style={{ flex: 1, margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                <h2 style={{ margin: 0, color: 'var(--primary)' }}>{ms.title}</h2>
                <span className="badge badge-info">PLANIFIÉ</span>
              </div>
              <p style={{ color: 'var(--text-primary)', marginBottom: 20 }}>{ms.description}</p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {ms.features.map((f, fi) => (
                  <span key={fi} style={{
                    padding: '4px 12px', background: 'var(--bg-hover)', borderRadius: 20,
                    fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--border)'
                  }}>
                    ✨ {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ background: 'var(--primary-glow)', borderColor: 'var(--primary)', textAlign: 'center', padding: '40px' }}>
        <h3 style={{ justifyContent: 'center', fontSize: 20 }}>💡 Vous avez une idée ?</h3>
        <p style={{ marginBottom: 20 }}>Nous sommes à l'écoute de nos utilisateurs pour façonner les prochaines fonctionnalités.</p>
        <button className="btn-primary">Suggérer une fonctionnalité</button>
      </div>
    </div>
  );
};

export default RoadmapPage;
