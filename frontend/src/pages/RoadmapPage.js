import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Cpu, Smartphone, BarChart3, Database, Globe, Shield, Rocket } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Déploiement de la nouvelle génération de scanners avec support biométrique optionnel et synchronisation temps réel offline.',
      icon: <Cpu size={24} />,
      status: 'planned',
      color: '#6366f1'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés : consultation des plannings, demandes de congés et notifications push.',
      icon: <Smartphone size={24} />,
      status: 'planned',
      color: '#10b981'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration d\'algorithmes d\'apprentissage automatique pour prédire les besoins en recrutement et détecter les risques d\'épuisement.',
      icon: <BarChart3 size={24} />,
      status: 'planned',
      color: '#f59e0b'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation automatique des données financières et RH.',
      icon: <Database size={24} />,
      status: 'planned',
      color: '#ec4899'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Rocket className="text-primary" size={32} />
            <h1>Roadmap Futur 2026</h1>
          </div>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques de la plateforme HR Manager</p>
        </div>
      </div>

      <div className="grid-1">
        <motion.div
          className="roadmap-timeline"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', paddingLeft: '40px' }}
        >
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: '15px', top: '0', bottom: '0',
            width: '2px', background: 'linear-gradient(to bottom, var(--primary), var(--primary-glow), transparent)',
            borderRadius: '1px'
          }} />

          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className="section-card"
              variants={itemVariants}
              style={{ marginBottom: '30px', position: 'relative' }}
            >
              {/* Dot on line */}
              <div style={{
                position: 'absolute', left: '-35px', top: '25px',
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'var(--bg-card)', border: `4px solid ${milestone.color}`,
                zIndex: 2, boxShadow: `0 0 10px ${milestone.color}80`
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    padding: '10px', borderRadius: '12px',
                    background: `${milestone.color}15`, color: milestone.color
                  }}>
                    {milestone.icon}
                  </div>
                  <div>
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '1px', color: milestone.color
                    }}>
                      {milestone.quarter}
                    </span>
                    <h3 style={{ margin: '4px 0 0 0' }}>{milestone.title}</h3>
                  </div>
                </div>
                <span className="badge badge-info" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                  En Planification
                </span>
              </div>

              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                {milestone.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="grid-3" style={{ marginTop: '20px' }}>
        <div className="section-card" style={{ textAlign: 'center' }}>
          <Globe className="text-primary" size={32} style={{ marginBottom: '15px' }} />
          <h4>Expansion Cloud</h4>
          <p className="small text-muted">Infrastructure distribuée mondialement pour une latence minimale.</p>
        </div>
        <div className="section-card" style={{ textAlign: 'center' }}>
          <Shield className="text-primary" size={32} style={{ marginBottom: '15px' }} />
          <h4>Sécurité Avancée</h4>
          <p className="small text-muted">Chiffrement de bout en bout et conformité RGPD renforcée.</p>
        </div>
        <div className="section-card" style={{ textAlign: 'center' }}>
          <Calendar className="text-primary" size={32} style={{ marginBottom: '15px' }} />
          <h4>Planification IA</h4>
          <p className="small text-muted">Optimisation automatique des plannings par intelligence artificielle.</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
