import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Smartphone, BrainCircuit, Globe, Zap } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Authentification Biométrique',
      description: 'Lancement de la nouvelle génération de badges QR sécurisés avec intégration optionnelle de reconnaissance faciale pour les zones sensibles.',
      icon: <ShieldCheck size={24} />,
      status: 'upcoming',
      color: 'var(--primary)'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native (iOS & Android)',
      description: 'Déploiement de l\'application mobile pour les employés : consultation des fiches de paie, demandes de congés et notifications push en temps réel.',
      icon: <Smartphone size={24} />,
      status: 'upcoming',
      color: 'var(--success)'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions RH',
      description: 'Moteur d\'intelligence artificielle pour prédire le turnover, optimiser les plannings et suggérer des formations basées sur les compétences.',
      icon: <BrainCircuit size={24} />,
      status: 'upcoming',
      color: 'var(--warning)'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale & API Publique',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle) et ouverture d\'une API sécurisée pour les partenaires.',
      icon: <Globe size={24} />,
      status: 'upcoming',
      color: 'var(--info)'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Rocket className="text-primary-color" size={32} />
            <h1 style={{ margin: 0 }}>Roadmap Futur 2026</h1>
          </div>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques de la plateforme HR Manager</p>
        </div>
        <div className="time-badge">
          <span className="badge badge-primary">Version 2.0.0 Alpha</span>
        </div>
      </div>

      <motion.div
        className="roadmap-timeline"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          padding: '40px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px'
        }}
      >
        {/* Center line for the timeline */}
        <div style={{
          position: 'absolute',
          left: '20px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, var(--primary), var(--accent), var(--success))',
          opacity: 0.3
        }}></div>

        {milestones.map((item, index) => (
          <motion.div
            key={index}
            className="roadmap-item"
            variants={itemVariants}
            style={{
              display: 'flex',
              gap: '24px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: `3px solid ${item.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color,
              boxShadow: `0 0 15px ${item.color}40`,
              flexShrink: 0
            }}>
              {item.icon}
            </div>

            <div className="section-card" style={{ flex: 1, borderLeft: `4px solid ${item.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: item.color,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {item.quarter}
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700 }}>{item.title}</h2>
                </div>
                <span className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Zap size={12} /> Prévu
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="section-card mt-6" style={{ background: 'var(--primary-glow)', border: '1px dashed var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '32px' }}>💡</div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>Une idée d'amélioration ?</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
              La roadmap est évolutive. N'hésitez pas à contacter l'équipe produit pour soumettre vos suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
