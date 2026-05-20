import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Optimisation de l\'Infrastructure',
      description: 'Migration vers une architecture microservices pour une scalabilité accrue et temps de réponse ultra-rapides.',
      status: 'upcoming',
      icon: '🚀'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android avec notifications push temps réel et mode hors-ligne pour les chantiers.',
      status: 'upcoming',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les besoins en recrutement et détecter les risques d\'absentéisme.',
      status: 'upcoming',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation financière bidirectionnelle.',
      status: 'upcoming',
      icon: '🔗'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et développements à venir pour 2026</p>
        </div>
      </div>

      <div className="stats-box" style={{ marginBottom: 32 }}>
        <h3>✨ Vision 2026</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8 }}>
          Notre mission est de transformer la gestion des ressources humaines par l'innovation technologique.
          En 2026, HR Manager deviendra une plateforme prédictive capable d'anticiper les besoins des collaborateurs
          et d'optimiser la performance opérationnelle grâce à l'intelligence artificielle.
        </p>
      </div>

      <div style={{ position: 'relative', paddingLeft: 40, borderLeft: '3px solid var(--primary-glow)' }}>
        {milestones.map((ms, index) => (
          <div key={index} className="section-card animate-slide-in" style={{
            marginBottom: 30,
            position: 'relative',
            animationDelay: `${index * 0.1}s`
          }}>
            <div style={{
              position: 'absolute',
              left: -58,
              top: 20,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--bg-sidebar)',
              border: '4px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              color: 'white',
              fontSize: 14
            }}>
              {index + 1}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: 8 }}>{ms.quarter}</span>
                <h2 style={{ margin: 0, fontSize: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {ms.icon} {ms.title}
                </h2>
              </div>
              <span className="role-badge role-chef_service">Planifié</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14, maxWidth: '80%' }}>
              {ms.description}
            </p>

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <div style={{ height: 6, flex: 1, background: 'var(--bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '0%', height: '100%', background: 'var(--grad-primary)' }}></div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>0%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
