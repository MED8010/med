import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapItems = [
    {
      phase: 'Phase 1: Fondations (Complété)',
      status: 'completed',
      items: [
        'Architecture Backend (Node/Express/MongoDB)',
        'Système d\'authentification JWT & RBAC',
        'Gestion complète des employés',
        'Module de pointage QR Code (V1)',
        'Gestion des congés et absences'
      ]
    },
    {
      phase: 'Phase 2: Optimisation Scanner (En cours)',
      status: 'active',
      items: [
        'Scanner Auto Mode (Hands-free)',
        'Gestion des doublons et cooldown',
        'Détection automatique Entrée/Sortie server-side',
        'Interface Scanner haute performance'
      ]
    },
    {
      phase: 'Phase 3: Analytique & IA (Q2 2026)',
      status: 'upcoming',
      items: [
        'Prédiction de l\'absentéisme par IA',
        'Optimisation automatique des plannings',
        'Tableaux de bord BI avancés',
        'Rapports de performance exportables (PDF/Excel)'
      ]
    },
    {
      phase: 'Phase 4: Expansion (Q3 2026)',
      status: 'upcoming',
      items: [
        'Application Mobile Native (iOS/Android)',
        'Notifications Push temps réel',
        'Intégration SAP / ERP d\'entreprise',
        'Portail employé en self-service complet'
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes de l'application RH</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="section-card">
          <h3>🎯 Vision du Projet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Notre objectif est de transformer la gestion des ressources humaines en une expérience fluide, data-driven et automatisée.
            L'innovation continue est au cœur de notre stratégie pour offrir les meilleurs outils aux administrateurs et aux employés.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="kpi-card kpi-info" style={{ padding: '15px' }}>
              <div className="kpi-label">Disponibilité</div>
              <div className="kpi-value" style={{ fontSize: '20px' }}>99.9%</div>
            </div>
            <div className="kpi-card kpi-success" style={{ padding: '15px' }}>
              <div className="kpi-label">Uptime</div>
              <div className="kpi-value" style={{ fontSize: '20px' }}>24/7</div>
            </div>
          </div>
        </div>

        <div className="section-card">
          <h3>💡 Dernières Innovations</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
             <li style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ fontSize: '20px' }}>⚡</span>
               <div>
                 <div style={{ fontWeight: 700 }}>Scanner Haute Vitesse</div>
                 <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Auto-détection intelligente des flux</div>
               </div>
             </li>
             <li style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ fontSize: '20px' }}>📊</span>
               <div>
                 <div style={{ fontWeight: 700 }}>Analytics Temps Réel</div>
                 <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Visualisation instantanée de la présence</div>
               </div>
             </li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 800 }}>🗺️ Jalons du Développement</h2>

        <div className="form-sections-container" style={{ gap: '20px' }}>
          {roadmapItems.map((phase, idx) => (
            <div key={idx} className="section-card" style={{
              borderLeft: `5px solid ${phase.status === 'completed' ? 'var(--success)' : phase.status === 'active' ? 'var(--primary)' : 'var(--border)'}`,
              opacity: phase.status === 'upcoming' ? 0.8 : 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>{phase.phase}</h4>
                <span className={`badge badge-${phase.status === 'completed' ? 'success' : phase.status === 'active' ? 'primary' : 'neutral'}`}>
                  {phase.status === 'completed' ? 'Terminé' : phase.status === 'active' ? 'En Cours' : 'À venir'}
                </span>
              </div>
              <ul style={{ paddingLeft: '20px' }}>
                {phase.items.map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
