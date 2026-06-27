import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      status: 'upcoming',
      description: 'Intégration de la reconnaissance faciale et amélioration de la sécurité des badges QR dynamiques.',
      features: ['Reconnaissance faciale', 'QR codes dynamiques', 'Nouveaux terminaux']
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      status: 'planned',
      description: 'Lancement de l\'application iOS & Android pour les employés et managers.',
      features: ['Notifications push', 'Pointage GPS', 'Self-service complet']
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      status: 'research',
      description: 'Utilisation de l\'IA pour prédire l\'absentéisme et optimiser les plannings.',
      features: ['Prédiction de turnover', 'Optimisation planning', 'Assistant RH IA']
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      status: 'long-term',
      description: 'Synchronisation bidirectionnelle avec SAP, Oracle et Microsoft Dynamics.',
      features: ['API Unifiée', 'Connecteurs natifs', 'Comptabilité temps réel']
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

      <div style={{ position: 'relative', paddingLeft: '30px', marginTop: '40px' }}>
        <div style={{
          position: 'absolute',
          left: '7px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'var(--border)',
          zIndex: 1
        }}></div>

        {milestones.map((ms, index) => (
          <div key={index} className="animate-slide-in" style={{
            marginBottom: '40px',
            position: 'relative',
            animationDelay: `${index * 0.1}s`
          }}>
            {/* Dot */}
            <div style={{
              position: 'absolute',
              left: '-30px',
              top: '5px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: ms.status === 'upcoming' ? 'var(--primary)' : 'var(--bg-card)',
              border: `3px solid ${ms.status === 'upcoming' ? 'var(--primary-light)' : 'var(--border)'}`,
              zIndex: 2,
              boxShadow: ms.status === 'upcoming' ? '0 0 10px var(--primary-glow)' : 'none'
            }}></div>

            <div className="section-card" style={{ marginLeft: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: 10 }}>{ms.quarter}</span>
                  <h2 style={{ fontSize: 20, margin: '5px 0' }}>{ms.title}</h2>
                </div>
                <span className={`badge ${
                  ms.status === 'upcoming' ? 'badge-success' :
                  ms.status === 'planned' ? 'badge-info' : 'badge-neutral'
                }`}>
                  {ms.status.charAt(0).toUpperCase() + ms.status.slice(1)}
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginTop: 15, fontSize: 15 }}>
                {ms.description}
              </p>

              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {ms.features.map((f, i) => (
                  <span key={i} style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-hover)',
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid var(--border)'
                  }}>
                    🔹 {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
