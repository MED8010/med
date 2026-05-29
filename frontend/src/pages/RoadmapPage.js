import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2',
      description: 'Lancement du nouveau système de pointage avec reconnaissance faciale optionnelle et géofencing.',
      icon: '🔐',
      color: 'var(--primary)'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Déploiement des applications iOS et Android pour une meilleure accessibilité en mobilité.',
      icon: '📱',
      color: 'var(--success)'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration de modèles d\'intelligence artificielle pour prédire les besoins en recrutement et analyser le turnover.',
      icon: '🤖',
      color: 'var(--info)'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle complète avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      icon: '🏢',
      color: 'var(--accent)'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et jalons de développement pour 2026</p>
        </div>
      </div>

      <div className="stats-box" style={{ padding: '40px' }}>
        <div style={{ position: 'relative' }}>
          {/* Vertical Line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'var(--border)',
            zIndex: '1'
          }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {milestones.map((m, i) => (
              <div key={i} className="animate-slide-in" style={{
                display: 'flex',
                gap: '30px',
                position: 'relative',
                zIndex: '2'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: `3px solid ${m.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {m.icon}
                </div>

                <div className="section-card" style={{ flex: 1, margin: 0, borderLeft: `4px solid ${m.color}` }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: `${m.color}20`,
                      color: m.color,
                      fontWeight: '700',
                      fontSize: '12px'
                    }}>
                      {m.quarter}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{m.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card" style={{ marginTop: '30px', background: 'var(--primary-glow)', border: '1px dashed var(--primary)' }}>
        <h3 style={{ color: 'var(--primary)' }}>💡 Suggestion de fonctionnalité ?</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Notre roadmap est évolutive. Si vous avez des besoins spécifiques, n'hésitez pas à contacter l'équipe produit.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
