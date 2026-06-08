import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Smartphone, BarChart3, Database } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'QR v2 System',
      description: 'Lancement du système de badges QR de seconde génération avec cryptage dynamique pour une sécurité renforcée.',
      icon: <ShieldCheck size={24} />,
      status: 'planned'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Déploiement des applications iOS et Android natives pour les employés et les gestionnaires.',
      icon: <Smartphone size={24} />,
      status: 'planned'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration de modèles d\'IA pour prédire les besoins en main-d\'œuvre et identifier les risques d\'épuisement.',
      icon: <BarChart3 size={24} />,
      status: 'planned'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle en temps réel avec les principaux ERP du marché (SAP, Oracle, Odoo).',
      icon: <Database size={24} />,
      status: 'planned'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="icon-circle" style={{ background: 'var(--grad-primary)', color: 'white' }}>
              <Rocket size={20} />
            </div>
            <h1>Roadmap Futur</h1>
          </div>
          <p className="page-subtitle">Vision Technologique & Évolutions 2026</p>
        </div>
      </div>

      <div className="stats-box" style={{ padding: '40px' }}>
        <div className="roadmap-timeline" style={{
          position: 'relative',
          paddingLeft: '40px',
          borderLeft: '2px dashed var(--primary-glow)'
        }}>
          {milestones.map((ms, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              style={{
                position: 'relative',
                marginBottom: '40px',
              }}
            >
              <div style={{
                position: 'absolute',
                left: '-52px',
                top: '0',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '3px solid var(--primary)',
                zIndex: 2
              }} />

              <div className="section-card" style={{
                marginLeft: '20px',
                borderLeft: '4px solid var(--primary)',
                background: 'var(--bg-hover)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div className="badge-primary" style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
                    {ms.quarter}
                  </div>
                  <div style={{ color: 'var(--primary)' }}>
                    {ms.icon}
                  </div>
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{ms.title}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  {ms.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <p className="text-muted" style={{ fontStyle: 'italic' }}>
          * Ces objectifs sont sujets à changement en fonction des priorités stratégiques.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
