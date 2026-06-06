import React from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Smartphone,
  BrainCircuit,
  Layers,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck
} from 'lucide-react';
import '../styles/Dashboard.css';

const milestones = [
  {
    quarter: 'Q1 2026',
    title: 'Système QR v2 & Biométrie',
    description: 'Introduction de la reconnaissance faciale optionnelle et des QR codes dynamiques anti-fraude.',
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    status: 'planned',
    tags: ['Sécurité', 'Hardware']
  },
  {
    quarter: 'Q2 2026',
    title: 'Application Mobile Native',
    description: 'Lancement des apps iOS et Android pour les employés : pointage géolocalisé et gestion des congés.',
    icon: <Smartphone className="w-6 h-6 text-accent" />,
    status: 'planned',
    tags: ['Mobile', 'UX']
  },
  {
    quarter: 'Q3 2026',
    title: 'Analytiques IA & Prédictions',
    description: 'Moteur de prédiction des absences et optimisation automatique de la planification des effectifs.',
    icon: <BrainCircuit className="w-6 h-6 text-purple-500" />,
    status: 'planned',
    tags: ['IA', 'Data']
  },
  {
    quarter: 'Q4 2026',
    title: 'Intégration ERP Totale',
    description: 'Synchronisation bidirectionnelle en temps réel avec SAP, Oracle et les systèmes de paie tiers.',
    icon: <Layers className="w-6 h-6 text-success" />,
    status: 'planned',
    tags: ['Enterprise', 'API']
  }
];

const RoadmapPage = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>🚀 Roadmap Futur</h1>
            <p className="page-subtitle">Vision Technologique & Jalons de Développement 2026</p>
          </motion.div>
        </div>
        <div className="time-badge">
          <span className="badge badge-primary">Version 2.0 Alpha</span>
        </div>
      </div>

      <div className="stats-box mb-6" style={{ background: 'var(--grad-primary)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: 'white' }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: 15,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Rocket size={32} />
          </div>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>Notre Vision 2026</h2>
            <p style={{ opacity: 0.9, margin: '5px 0 0', fontSize: '14px' }}>
              Transformer la gestion des ressources humaines par l'innovation continue et l'automatisation intelligente.
            </p>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: '20px' }}>
        {/* Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '30px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'var(--border)',
          zIndex: 0
        }}></div>

        <div style={{ display: 'grid', gap: '30px', position: 'relative', zIndex: 1 }}>
          {milestones.map((ms, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="section-card"
              style={{
                marginLeft: '40px',
                position: 'relative',
                borderLeft: index % 2 === 0 ? '4px solid var(--primary)' : '4px solid var(--secondary)'
              }}
            >
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '-54px',
                top: '20px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: `4px solid ${index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 15 }}>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  <div style={{
                    padding: 10,
                    borderRadius: 12,
                    background: 'var(--bg-hover)',
                    color: 'var(--primary)'
                  }}>
                    {ms.icon}
                  </div>
                  <div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
                      textTransform: 'uppercase'
                    }}>
                      {ms.quarter}
                    </span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '18px' }}>{ms.title}</h3>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ms.tags.map(tag => (
                    <span key={tag} className="badge badge-neutral" style={{ fontSize: '10px' }}>{tag}</span>
                  ))}
                </div>
              </div>

              <p style={{ marginTop: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {ms.description}
              </p>

              <div style={{
                marginTop: 20,
                paddingTop: 15,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <Clock size={14} />
                <span>Statut : </span>
                <span className="badge badge-warning" style={{ fontSize: '10px' }}>En planification</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid-2 mt-6">
        <div className="section-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap className="text-warning" size={20} />
            Focus Technologique
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 15 }}>
            {[
              'Microservices Architecture (Node.js)',
              'Infrastructure Cloud Multi-région',
              'Sécurité Zero Trust & Audit Log',
              'IA générative pour le support RH'
            ].map((item, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
                fontSize: '13px'
              }}>
                <CheckCircle2 size={16} className="text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>
            <Rocket size={40} className="text-primary" />
          </div>
          <h3>Prêt pour le futur ?</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
            Contribuez au développement de la plateforme en nous faisant part de vos besoins métiers.
          </p>
          <button className="btn-primary mt-4">
            Proposer une fonctionnalité
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
