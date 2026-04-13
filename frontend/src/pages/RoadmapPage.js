import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const goals = [
    {
      quarter: 'Q1 2026',
      status: 'En cours',
      features: [
        { title: 'Scanner QR Avancé', desc: 'Mode mains-libres avec détection auto entrée/sortie.', icon: '📷', completed: true },
        { title: 'Export PDF Rapports', desc: 'Génération de rapports PDF pour les pointages et retards.', icon: '📄', completed: true },
        { title: 'Système de Notifications', desc: 'Alertes en temps réel pour les admins et employés.', icon: '🔔', completed: true },
      ]
    },
    {
      quarter: 'Q2 2026',
      status: 'Planifié',
      features: [
        { title: 'Module de Formations', desc: 'Gestion des compétences et catalogues de formations.', icon: '🎓', completed: false },
        { title: 'Reconnaissance Faciale', desc: 'Alternative au QR code pour plus de sécurité.', icon: '👤', completed: false },
        { title: 'App Mobile Native', desc: 'Version iOS et Android pour les employés sur le terrain.', icon: '📱', completed: false },
      ]
    },
    {
      quarter: 'Q3 2026',
      status: 'Futur',
      features: [
        { title: 'IA Prédictive RH', desc: 'Analyse des tendances d\'absentéisme et turn-over.', icon: '🤖', completed: false },
        { title: 'Signature Électronique', desc: 'Contrats et documents RH signables numériquement.', icon: '✍️', completed: false },
        { title: 'Portail Candidats', desc: 'Module complet de recrutement et onboarding.', icon: '🤝', completed: false },
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes du projet RH</p>
        </div>
      </div>

      <div className="roadmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30, marginTop: 20 }}>
        {goals.map((q, idx) => (
          <div key={idx} className="section-card" style={{ borderTop: `4px solid ${idx === 0 ? 'var(--primary)' : 'var(--border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{q.quarter}</h2>
              <span className={`badge badge-${q.status === 'En cours' ? 'primary' : q.status === 'Planifié' ? 'warning' : 'neutral'}`}>
                {q.status}
              </span>
            </div>

            <div className="feature-list" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {q.features.map((f, fIdx) => (
                <div key={fIdx} style={{
                  padding: 15,
                  background: 'var(--bg-hover)',
                  borderRadius: 12,
                  opacity: f.completed ? 1 : 0.8,
                  border: f.completed ? '1px solid var(--primary-glow)' : '1px solid transparent'
                }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: '1.2rem' }}>{f.icon}</span>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{f.title}</h4>
                    {f.completed && <span style={{ marginLeft: 'auto', color: 'var(--success)' }}>✓</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 40, textAlign: 'center', background: 'var(--grad-primary)', color: 'white' }}>
        <h3 style={{ color: 'white', justifyContent: 'center' }}>🚀 Vers une gestion RH 4.0</h3>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.9 }}>
          Notre vision est de simplifier chaque interaction RH grâce à la technologie,
          en mettant l'humain au centre de l'innovation digitale.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
