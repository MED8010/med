import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Intégration de la reconnaissance faciale optionnelle et badges QR dynamiques haute sécurité.',
      status: 'planned',
      icon: '🛡️'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés (Pointage géolocalisé, Notifications Push).',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour la prédiction des besoins en recrutement et analyse du turnover.',
      status: 'planned',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation financière temps réel.',
      status: 'planned',
      icon: '🔗'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ marginTop: '40px' }}>
        {milestones.map((item, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden', animationDelay: `${index * 0.1}s` }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{
                fontSize: '40px',
                background: 'var(--primary-glow)',
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '14px', padding: '6px 12px' }}>{item.quarter}</span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>{item.title}</h2>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>{item.description}</p>
              </div>
            </div>
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              fontSize: '120px',
              opacity: '0.03',
              pointerEvents: 'none'
            }}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ background: 'var(--grad-primary)', color: 'white', marginTop: '40px' }}>
        <h3 style={{ color: 'white' }}>🚀 En route vers l'excellence RH</h3>
        <p style={{ opacity: 0.9 }}>
          Notre engagement est de fournir les outils les plus performants pour la gestion de votre capital humain.
          Cette roadmap est indicative et peut évoluer selon vos retours et les besoins du marché.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
