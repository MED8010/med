import React from 'react';
import { Rocket, Calendar, Shield, Cpu, Zap, Globe } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système de Pointage QR v2',
      description: 'Déploiement du mode automatique haute fidélité et intégration avec les tablettes murales.',
      icon: <Zap size={24} />,
      status: 'En cours',
      color: 'var(--primary)'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des apps iOS et Android pour les employés avec notifications push géolocalisées.',
      icon: <Globe size={24} />,
      status: 'Planifié',
      color: 'var(--info)'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur de prédiction des besoins en ressources humaines basé sur l\'intelligence artificielle.',
      icon: <Cpu size={24} />,
      status: 'Planifié',
      color: 'var(--secondary)'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      icon: <Shield size={24} />,
      status: 'Futur',
      color: 'var(--success)'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes de l'écosystème HR Manager</p>
        </div>
        <div className="time-badge">
          <span className="date-display">Version 2.0 en préparation</span>
          <span className="time-display">Horizon 2026</span>
        </div>
      </div>

      <div className="section-card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 40 }}>
          <div style={{ padding: 12, background: 'var(--primary-glow)', borderRadius: 12 }}>
            <Rocket color="var(--primary)" size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Vision 2026</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Vers une gestion des ressources humaines intelligente et automatisée.</p>
          </div>
        </div>

        <div style={{ position: 'relative', paddingLeft: 30 }}>
          {/* Vertical Line */}
          <div style={{
            position: 'absolute', left: 8, top: 10, bottom: 10,
            width: 2, background: 'var(--border)',
            backgroundImage: 'linear-gradient(to bottom, var(--primary), var(--border) 80%)'
          }}></div>

          <div style={{ display: 'grid', gap: 40 }}>
            {milestones.map((ms, index) => (
              <div key={index} className="animate-slide-in" style={{ position: 'relative', animationDelay: `${index * 0.1}s` }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -31, top: 5,
                  width: 18, height: 18, borderRadius: '50%',
                  background: index === 0 ? 'var(--primary)' : 'var(--bg-card)',
                  border: `3px solid ${index === 0 ? 'var(--primary-glow)' : 'var(--border)'}`,
                  zIndex: 2
                }}></div>

                <div className="stats-box" style={{
                  marginLeft: 10,
                  borderLeft: `4px solid ${ms.color}`,
                  display: 'flex',
                  gap: 20,
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    padding: 12,
                    background: `${ms.color}15`,
                    color: ms.color,
                    borderRadius: 12
                  }}>
                    {ms.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: ms.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {ms.quarter}
                      </span>
                      <span className={`badge ${ms.status === 'En cours' ? 'badge-primary' : 'badge-neutral'}`}>
                        {ms.status}
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{ms.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>{ms.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 30 }}>
        <div className="section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
            <Calendar size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Cycle de Release</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Nous suivons un cycle de release trimestriel. Chaque fin de trimestre, une mise à jour majeure est déployée après une phase de beta-test d'un mois.
          </p>
        </div>
        <div className="section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
            <Shield size={20} color="var(--success)" />
            <h3 style={{ margin: 0 }}>Sécurité & Stabilité</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            La sécurité des données est notre priorité absolue. Toutes les futures fonctionnalités passent par un audit de sécurité complet avant d'être intégrées.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
