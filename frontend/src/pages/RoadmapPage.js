import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Intégration de la reconnaissance faciale optionnelle et badges NFC haute sécurité.',
      status: 'planned',
      icon: '🛡️'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Sortie des apps iOS et Android pour les employés avec notifications push en temps réel.',
      status: 'design',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Algorithmes prédictifs pour l\'absentéisme et optimisation automatique des plannings.',
      status: 'research',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      status: 'upcoming',
      icon: '🌐'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques 2026</p>
        </div>
      </div>

      <div className="roadmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 20 }}>
        {milestones.map((ms, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="section-card roadmap-card"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 80, opacity: 0.05 }}>
              {ms.icon}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{
                background: 'var(--primary-glow)',
                color: 'var(--primary)',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700
              }}>
                {ms.quarter}
              </span>
              <span style={{ fontSize: 24 }}>{ms.icon}</span>
            </div>

            <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>{ms.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: 14 }}>
              {ms.description}
            </p>

            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: ms.status === 'planned' ? '15%' : ms.status === 'design' ? '5%' : '0%',
                  background: 'var(--primary)',
                  borderRadius: 2
                }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 1 }}>
                {ms.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 40, textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>💡</div>
        <h2 style={{ marginBottom: 16 }}>Votre avis compte</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 24px' }}>
          Nous construisons le futur de la gestion RH ensemble. Si vous avez des suggestions de fonctionnalités
          pour la roadmap 2026, n'hésitez pas à contacter l'équipe produit.
        </p>
        <button className="btn-primary">Proposer une idée</button>
      </div>
    </div>
  );
};

export default RoadmapPage;
