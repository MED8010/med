import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2',
      description: 'Déploiement de la nouvelle génération de terminaux de pointage avec reconnaissance faciale optionnelle.',
      status: 'upcoming',
      icon: '🚀'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés (self-service, notifications push).',
      status: 'upcoming',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur de prédiction de l\'absentéisme basé sur l\'apprentissage automatique et optimisation des plannings.',
      status: 'upcoming',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle en temps réel avec SAP, Oracle et Microsoft Dynamics.',
      status: 'upcoming',
      icon: '🔗'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes de développement 2026</p>
        </div>
      </div>

      <div className="section-card">
        <div style={{ position: 'relative', padding: '20px 0' }}>
          {/* Timeline Line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '0',
            bottom: '0',
            width: '4px',
            background: 'var(--primary-glow)',
            borderRadius: '2px'
          }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {milestones.map((ms, index) => (
              <div key={index} style={{ position: 'relative', paddingLeft: '60px' }} className="animate-slide-in">
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '0',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '4px solid var(--primary)',
                  zIndex: 2
                }}></div>

                <div className="stats-box" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span className="badge badge-primary">{ms.quarter}</span>
                    <span style={{ fontSize: '24px' }}>{ms.icon}</span>
                  </div>
                  <h3 style={{ marginBottom: 10, fontSize: '18px' }}>{ms.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{ms.description}</p>

                  <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: '10%', background: 'var(--primary-light)' }}></div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>EN PLANIFICATION</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 40 }}>
        <div className="section-card" style={{ background: 'var(--grad-primary)', color: 'white', border: 'none' }}>
          <h3 style={{ color: 'white' }}>✨ Innovation Continue</h3>
          <p style={{ opacity: 0.9 }}>
            Notre équipe R&D travaille constamment sur de nouvelles fonctionnalités pour simplifier votre gestion RH au quotidien.
          </p>
        </div>
        <div className="section-card">
          <h3>📩 Suggérer une fonctionnalité</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 15 }}>
            Vous avez une idée pour améliorer notre plateforme ? Nous sommes à votre écoute !
          </p>
          <button className="btn-primary">Envoyer un Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
