import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Déploiement de la nouvelle génération de QR codes sécurisés et intégration optionnelle avec lecteurs biométriques USB.',
      status: 'planned',
      icon: '🔐'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push et self-service complet.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire l\'absentéisme et optimiser la planification des ressources.',
      status: 'upcoming',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation financière en temps réel.',
      status: 'upcoming',
      icon: '🔌'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Découvrez les prochaines étapes de l'évolution de HR Manager</p>
        </div>
      </div>

      <div className="section-card">
        <div className="roadmap-timeline" style={{ padding: '20px 0' }}>
          {milestones.map((milestone, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: 30,
              marginBottom: 40,
              position: 'relative'
            }}>
              {/* Timeline Line */}
              {index !== milestones.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: 30,
                  top: 60,
                  bottom: -40,
                  width: 2,
                  background: 'var(--border)',
                  zIndex: 0
                }} />
              )}

              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: milestone.status === 'planned' ? 'var(--primary-glow)' : 'var(--bg-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                border: `2px solid ${milestone.status === 'planned' ? 'var(--primary)' : 'var(--border)'}`,
                zIndex: 1,
                flexShrink: 0
              }}>
                {milestone.icon}
              </div>

              <div style={{ flex: 1, paddingBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--primary)',
                    background: 'var(--primary-glow)',
                    padding: '4px 10px',
                    borderRadius: 20,
                    textTransform: 'uppercase'
                  }}>
                    {milestone.quarter}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{milestone.title}</h3>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="section-card" style={{ background: 'var(--grad-primary)', color: 'white' }}>
          <h3 style={{ color: 'white' }}>🚀 Vision 2027</h3>
          <p style={{ opacity: 0.9 }}>
            Notre objectif est de transformer HR Manager en une plateforme de "Total Talent Management"
            utilisant l'IA générative pour l'aide au recrutement et la gestion de carrière.
          </p>
        </div>
        <div className="section-card">
          <h3>📢 Votre Avis Compte</h3>
          <p>
            Vous avez une suggestion pour une fonctionnalité ? Contactez l'équipe de développement
            directement depuis votre profil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
