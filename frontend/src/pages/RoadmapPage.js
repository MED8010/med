import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Smartphone, BrainCircuit, Globe } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'QR v2 System',
      description: 'Lancement du nouveau système de QR codes dynamiques avec cryptage haute sécurité et support hors-ligne.',
      icon: <ShieldCheck size={32} />,
      status: 'planned',
      color: '#6366f1'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Déploiement des applications iOS et Android pour les employés avec notifications push en temps réel.',
      icon: <Smartphone size={32} />,
      status: 'planned',
      color: '#8b5cf6'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les besoins en recrutement et analyser les tendances d\'absentéisme.',
      icon: <BrainCircuit size={32} />,
      status: 'planned',
      color: '#06b6d4'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation financière en temps réel.',
      icon: <Globe size={32} />,
      status: 'planned',
      color: '#10b981'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur 2026</h1>
          <p className="page-subtitle">Découvrez les prochaines innovations de HR Manager</p>
        </div>
        <div className="time-badge">
          <div className="date-display"><Rocket size={20} color="var(--primary)" /> Vision 2026</div>
        </div>
      </div>

      <div className="roadmap-grid" style={{ display: 'grid', gap: '30px', marginTop: '20px' }}>
        {milestones.map((m, idx) => (
          <motion.div
            key={idx}
            className="section-card"
            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              position: 'relative',
              borderLeft: `6px solid ${m.color}`
            }}
          >
            <div style={{
              background: `${m.color}20`,
              color: m.color,
              padding: '20px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {m.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  background: m.color,
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  {m.quarter}
                </span>
                <span className="badge badge-info">Prévu</span>
              </div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{m.title}</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {m.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: '40px', textAlign: 'center', background: 'var(--grad-primary)', color: '#fff' }}>
        <h3 style={{ color: '#fff', justifyContent: 'center' }}>🚀 Vers une gestion RH augmentée</h3>
        <p style={{ maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
          Notre mission est de transformer la gestion des ressources humaines par l'innovation technologique.
          Ces jalons représentent notre engagement envers l'excellence opérationnelle et l'expérience employé.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
