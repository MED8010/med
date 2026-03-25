import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapData = [
    {
      title: 'Phase 1 : Optimisation & Mobilité (Q2 2026)',
      status: 'upcoming',
      items: [
        { name: 'Application Mobile (iOS & Android)', description: 'Une version mobile dédiée pour les employés afin de consulter leurs bulletins et demander des congés.' },
        { name: 'Notifications Push', description: 'Alertes en temps réel pour les approbations de congés et rappels de pointage.' },
        { name: 'Self-Service Documentaire', description: 'Téléchargement autonome d\'attestations de travail et fiches de paie.' }
      ]
    },
    {
      title: 'Phase 2 : Intelligence Artificielle & Analytics (Q4 2026)',
      status: 'upcoming',
      items: [
        { name: 'Prédiction de l\'Absentéisme', description: 'Algorithmes de Machine Learning pour anticiper les pics d\'absentéisme selon les périodes.' },
        { name: 'Chatbot RH 24/7', description: 'Assistant virtuel pour répondre aux questions fréquentes des employés sur les politiques internes.' },
        { name: 'Optimisation de la Masse Salariale', description: 'Outils d\'aide à la décision pour le recrutement et les augmentations.' }
      ]
    },
    {
      title: 'Phase 3 : Écosystème Global (2027)',
      status: 'vision',
      items: [
        { name: 'Module de Recrutement (ATS)', description: 'Gestion complète du cycle de recrutement, de l\'offre à l\'onboarding.' },
        { name: 'Plateforme de Formation (LMS)', description: 'Espace dédié au développement des compétences et au suivi des formations.' },
        { name: 'Intégration ERP Tierce', description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics.' }
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions à venir de la plateforme RH</p>
        </div>
      </div>

      <div className="roadmap-grid" style={{ display: 'grid', gap: 30, marginTop: 20 }}>
        {roadmapData.map((phase, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: 'var(--primary)' }}>{phase.title}</h2>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                background: phase.status === 'vision' ? 'var(--primary-glow)' : 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary)'
              }}>
                {phase.status === 'vision' ? '🔭 Vision' : '📅 Planifié'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {phase.items.map((item, i) => (
                <div key={i} style={{
                  padding: 20,
                  background: 'var(--bg-body)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  transition: 'transform 0.2s'
                }}
                className="hover-card"
                >
                  <h4 style={{ marginTop: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--primary)' }}>•</span> {item.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 40, textAlign: 'center', background: 'var(--primary-glow)', border: 'none' }}>
        <h3 style={{ color: 'var(--primary)' }}>Vous avez une suggestion ?</h3>
        <p>Notre roadmap est collaborative. N'hésitez pas à nous faire part de vos besoins spécifiques pour faire évoluer l'outil.</p>
        <button className="btn-primary" style={{ marginTop: 10 }}>Proposer une fonctionnalité</button>
      </div>
    </div>
  );
};

export default RoadmapPage;
