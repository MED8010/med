import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q2 2026',
      title: '📱 Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés avec notifications push et pointage GPS.',
      status: 'planning',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: '🤖 Analytiques IA & Prédictions',
      description: 'Mise en place d\'algorithmes de prédiction d\'absentéisme et d\'optimisation de la masse salariale.',
      status: 'upcoming',
      icon: '🤖'
    },
    {
      quarter: 'Q4 2026',
      title: '🏢 Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      status: 'upcoming',
      icon: '🏢'
    },
    {
      quarter: 'Q1 2027',
      title: '🌍 Expansion Multi-Devises',
      description: 'Support complet des paies internationales et gestion des taux de change en temps réel.',
      status: 'upcoming',
      icon: '🌍'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines évolutions du système RH</p>
        </div>
      </div>

      <div className="section-card">
        <div className="timeline-container" style={{ padding: '20px 0' }}>
          {milestones.map((item, index) => (
            <div
              key={index}
              className="animate-slide-in"
              style={{
                display: 'flex',
                gap: 30,
                marginBottom: 40,
                position: 'relative',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{
                minWidth: 100,
                textAlign: 'right',
                fontWeight: 800,
                color: 'var(--primary)',
                fontSize: 18,
                paddingTop: 10
              }}>
                {item.quarter}
              </div>

              <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  zIndex: 2,
                  boxShadow: '0 0 0 6px var(--primary-glow)'
                }}>
                  {index + 1}
                </div>
                {index !== milestones.length - 1 && (
                  <div style={{
                    width: 2,
                    flex: 1,
                    background: 'var(--border)',
                    margin: '10px 0'
                  }} />
                )}
              </div>

              <div className="kpi-card" style={{ flex: 1, margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{item.title}</h3>
                  <span className={`badge ${item.status === 'planning' ? 'badge-primary' : 'badge-neutral'}`}>
                    {item.status === 'planning' ? 'En Conception' : 'À venir'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 30 }}>
        <div className="section-card" style={{ background: 'var(--primary-glow)', border: '1px dashed var(--primary)' }}>
          <h3 style={{ color: 'var(--primary)' }}>💡 Suggestion de Fonctionnalité</h3>
          <p>Vous avez une idée pour améliorer l'application ? Contactez notre équipe produit pour soumettre vos besoins spécifiques.</p>
          <button className="btn-primary" style={{ marginTop: 10 }}>
            Envoyer un Feedback
          </button>
        </div>

        <div className="section-card">
          <h3>📈 Prochaine Mise à Jour</h3>
          <div className="detail-item">
            <label>Version</label>
            <span className="badge badge-info">v1.1.0</span>
          </div>
          <div className="detail-item">
            <label>Date Prévue</label>
            <span>15 Mars 2026</span>
          </div>
          <div className="detail-item">
            <label>Focus</label>
            <span>Optimisation des performances API</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
