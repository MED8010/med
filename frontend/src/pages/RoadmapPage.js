import React from 'react';
import { Rocket, Smartphone, PieChart, ShieldCheck } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2',
      description: 'Lancement du système de QR codes dynamiques avec biométrie faciale optionnelle pour une sécurité accrue.',
      icon: <ShieldCheck size={24} />,
      status: 'upcoming'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Déploiement des apps iOS et Android pour les employés : consultation des fiches de paie et demandes de congés.',
      icon: <Smartphone size={24} />,
      status: 'upcoming'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les tendances d\'absentéisme et optimiser la planification.',
      icon: <PieChart size={24} />,
      status: 'upcoming'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle en temps réel avec les principaux ERP du marché (SAP, Oracle, Sage).',
      icon: <Rocket size={24} />,
      status: 'upcoming'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes technologiques (2026)</p>
        </div>
      </div>

      <div className="section-card">
        <div className="roadmap-timeline" style={{ position: 'relative', padding: '20px 0' }}>
          <div style={{
            position: 'absolute', left: '24px', top: '0', bottom: '0',
            width: '2px', background: 'var(--primary-glow)', zIndex: '1'
          }}></div>

          {milestones.map((ms, index) => (
            <div key={index} className="milestone-item animate-slide-in" style={{
              display: 'flex', gap: '24px', marginBottom: '40px', position: 'relative', zIndex: '2'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '12px', background: 'var(--grad-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                boxShadow: 'var(--shadow-primary)', flexShrink: 0
              }}>
                {ms.icon}
              </div>

              <div className="milestone-content" style={{
                background: 'var(--bg-hover)', padding: '20px', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', flex: 1
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{ms.title}</h3>
                  <span className="badge badge-primary">{ms.quarter}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{ms.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <div className="stats-box">
          <h3>🚀 Vision 2026</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Notre objectif est de transformer la gestion RH d'un centre de coût vers un centre de valeur stratégique,
            en utilisant les technologies les plus avancées pour simplifier le quotidien des collaborateurs.
          </p>
        </div>
        <div className="stats-box">
          <h3>💡 Innovation Continue</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Plus de 20% de nos ressources sont allouées à la recherche et au développement pour garantir
            que notre plateforme reste à la pointe de l'industrie.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
