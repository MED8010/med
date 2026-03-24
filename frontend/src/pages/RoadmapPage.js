import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapItems = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Dédiée',
      description: 'Lancement de l\'application mobile iOS & Android pour les employés avec notifications push en temps réel.',
      status: 'in-progress',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analyse Prédictive IA',
      description: 'Utilisation de l\'intelligence artificielle pour prédire les tendances d\'absentéisme et optimiser la planification.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: '💳 Automatisation Paie Avancée',
      description: 'Intégration directe avec les systèmes bancaires pour les virements automatiques et gestion multi-devises.',
      status: 'planned',
      icon: '💳'
    },
    {
      quarter: 'Q1 2027',
      title: '🌐 Portail Self-Service Externe',
      description: 'Interface pour les candidats et partenaires externes pour la gestion des recrutements et des stages.',
      status: 'planned',
      icon: '🌐'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Vision et Prochaines Étapes du Projet RH Manager</p>
        </div>
      </div>

      <div className="section-card" style={{ padding: '30px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '800px', lineHeight: '1.6' }}>
          Notre vision est de transformer la gestion des ressources humaines en une expérience fluide, data-driven et centrée sur l'humain.
          Voici les jalons majeurs prévus pour les prochains mois.
        </p>

        <div className="roadmap-timeline" style={{ position: 'relative', paddingLeft: '40px' }}>
          <div style={{
            position: 'absolute', left: '15px', top: 0, bottom: 0,
            width: '2px', background: 'linear-gradient(to bottom, var(--primary), transparent)',
            opacity: 0.3
          }}></div>

          {roadmapItems.map((item, index) => (
            <div key={index} className="roadmap-item" style={{ position: 'relative', marginBottom: '40px' }}>
              <div style={{
                position: 'absolute', left: '-33px', top: '0',
                width: '18px', height: '18px', borderRadius: '50%',
                background: item.status === 'in-progress' ? 'var(--primary)' : 'var(--bg-card)',
                border: '3px solid var(--primary)', zIndex: 2
              }}></div>

              <div className="animate-slide-in" style={{
                background: 'var(--bg-card)', padding: '24px', borderRadius: '16px',
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                animationDelay: `${index * 0.1}s`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)',
                    background: 'var(--primary-glow)', padding: '4px 12px', borderRadius: '20px'
                  }}>
                    {item.quarter}
                  </span>
                  {item.status === 'in-progress' && (
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>EN COURS</span>
                  )}
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   {item.title}
                </h3>

                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '30px' }}>
        <div className="section-card">
          <h3>💡 Proposez une Idée</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Vous avez une suggestion pour améliorer le système ? Nous sommes à l'écoute de nos utilisateurs.
          </p>
          <button className="btn-primary" style={{ marginTop: '10px' }}>
            Soumettre une suggestion
          </button>
        </div>
        <div className="section-card">
          <h3>📈 Prochaine Mise à Jour</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            La version 1.1.0 est prévue pour le mois prochain avec des améliorations sur les rapports PDF et Excel.
          </p>
          <div className="progress-bar" style={{ marginTop: '15px' }}>
            <div className="progress-fill" style={{ width: '75%' }}></div>
          </div>
          <p style={{ fontSize: '12px', marginTop: '8px', textAlign: 'right', fontWeight: 'bold' }}>75% Terminé</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
