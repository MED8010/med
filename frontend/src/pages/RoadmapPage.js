import React from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Smartphone,
  BarChart3,
  Cpu,
  Globe,
  Zap,
  ShieldCheck,
  Users
} from 'lucide-react';
import '../styles/Dashboard.css';

const milestones = [
  {
    quarter: 'T1 2026',
    title: 'Système QR v2 & Biométrie',
    description: 'Lancement du nouveau système de pointage avec support biométrique facial et QR codes dynamiques sécurisés.',
    icon: <QrCode size={24} />,
    color: '#6366f1',
    features: ['QR Dynamique', 'Reconnaissance Faciale', 'Mode Hors-ligne']
  },
  {
    quarter: 'T2 2026',
    title: 'Application Mobile Native',
    description: 'Application iOS et Android complète pour les employés : gestion des congés, fiches de paie et messagerie interne.',
    icon: <Smartphone size={24} />,
    color: '#8b5cf6',
    features: ['iOS & Android', 'Notifications Push', 'Self-service RH']
  },
  {
    quarter: 'T3 2026',
    title: 'Analytiques IA & Prédictions',
    description: 'Moteur d\'intelligence artificielle pour prédire l\'absentéisme et optimiser la planification des ressources.',
    icon: <BarChart3 size={24} />,
    color: '#06b6d4',
    features: ['Prédiction Absentéisme', 'Optimisation Planning', 'Insights IA']
  },
  {
    quarter: 'T4 2026',
    title: 'Intégration ERP Totale',
    description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation financière en temps réel.',
    icon: <Cpu size={24} />,
    color: '#10b981',
    features: ['Connecteur SAP', 'Sync Comptable', 'API Ouverte']
  }
];

const RoadmapPage = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision Technologique & Jalons 2026</p>
        </div>
        <div className="page-actions">
          <span className="badge badge-primary">Version 2.0 en cours</span>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 40, paddingBottom: 60 }}>
        {/* Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 4,
          background: 'var(--border)',
          transform: 'translateX(-50%)',
          borderRadius: 2,
          zIndex: 0
        }} className="roadmap-line" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
          {milestones.map((ms, index) => (
            <motion.div
              key={ms.quarter}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: 'flex',
                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                alignItems: 'center',
                width: '100%',
                position: 'relative'
              }}
            >
              {/* Central Point */}
              <div style={{
                position: 'absolute',
                left: '50%',
                width: 20,
                height: 20,
                background: ms.color,
                borderRadius: '50%',
                border: '4px solid var(--bg)',
                transform: 'translateX(-50%)',
                zIndex: 1,
                boxShadow: `0 0 15px ${ms.color}`
              }} />

              <div style={{
                width: '45%',
                background: 'var(--bg-card)',
                borderRadius: 20,
                padding: 30,
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                  marginBottom: 15
                }}>
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: `${ms.color}15`,
                    color: ms.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {ms.icon}
                  </div>
                  <div>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: ms.color,
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}>
                      {ms.quarter}
                    </span>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{ms.title}</h3>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  {ms.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ms.features.map(f => (
                    <span key={f} style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '4px 10px',
                      background: 'var(--bg-hover)',
                      borderRadius: 20,
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)'
                    }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 40 }}>
        <div className="section-card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ color: 'var(--primary)', marginBottom: 15 }}><Globe size={40} style={{ margin: '0 auto' }} /></div>
          <h4>Expansion Globale</h4>
          <p className="text-muted">Déploiement sur plusieurs sites avec synchronisation cloud temps réel.</p>
        </div>
        <div className="section-card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ color: 'var(--success)', marginBottom: 15 }}><Zap size={40} style={{ margin: '0 auto' }} /></div>
          <h4>Performance</h4>
          <p className="text-muted">Optimisation du moteur de calcul pour traiter des milliers d'employés.</p>
        </div>
        <div className="section-card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ color: 'var(--secondary)', marginBottom: 15 }}><ShieldCheck size={40} style={{ margin: '0 auto' }} /></div>
          <h4>Sécurité</h4>
          <p className="text-muted">Conformité RGPD totale et chiffrement bout-en-bout des données sensibles.</p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
