import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Smartphone, Cpu, ShieldCheck } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'QR v2 System',
      description: 'Système de QR codes dynamiques avec régénération automatique pour une sécurité accrue contre la fraude au pointage.',
      icon: <Cpu size={32} />,
      color: '#6366f1'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour permettre aux employés de consulter leur profil et pointer via géofencing.',
      icon: <Smartphone size={32} />,
      color: '#10b981'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Mise en œuvre d\'algorithmes d\'IA pour prédire les tendances d\'absentéisme et optimiser la planification des ressources.',
      icon: <Calendar size={32} />,
      color: '#f59e0b'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour les principaux ERP du marché (SAP, Oracle, Odoo) pour une synchronisation comptable en temps réel.',
      icon: <ShieldCheck size={32} />,
      color: '#ef4444'
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
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Développement et Innovations Stratégiques 2026</p>
        </div>
      </div>

      <motion.div
        className="roadmap-timeline"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          padding: '20px 0',
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        {/* Timeline vertical line */}
        <div style={{
          position: 'absolute',
          left: '40px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, var(--primary), var(--secondary))',
          opacity: 0.3
        }} />

        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            style={{
              display: 'flex',
              gap: '30px',
              marginBottom: '40px',
              position: 'relative'
            }}
          >
            {/* Timeline Dot */}
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: milestone.color,
              border: '4px solid var(--bg-card)',
              position: 'absolute',
              left: '33px',
              top: '25px',
              zIndex: 2,
              boxShadow: `0 0 10px ${milestone.color}`
            }} />

            <div style={{
              width: '80px',
              paddingTop: '20px',
              textAlign: 'right',
              fontSize: '14px',
              fontWeight: '800',
              color: milestone.color
            }}>
              {milestone.quarter}
            </div>

            <div className="section-card" style={{ flex: 1, margin: 0, display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: `${milestone.color}20`,
                color: milestone.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {milestone.icon}
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{milestone.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {milestone.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RoadmapPage;
