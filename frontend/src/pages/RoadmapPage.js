import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Smartphone, Brain, Globe, CheckCircle2, Timer } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Sécurité',
      description: 'Déploiement de QR codes dynamiques avec régénération automatique toutes les 30 secondes pour prévenir toute fraude.',
      icon: <Rocket className="roadmap-icon" />,
      status: 'En planning',
      features: ['QR Dynamiques', 'Géo-clôture active', 'Authentification biométrique optionnelle']
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android dédiées pour les employés et managers avec notifications push en temps réel.',
      icon: <Smartphone className="roadmap-icon" />,
      status: 'À venir',
      features: ['Self-service mobile', 'Scan via app native', 'Mode hors-ligne']
    },
    {
      quarter: 'Q3 2026',
      title: 'IA & Analytiques RH',
      description: 'Intégration de modèles d\'intelligence artificielle pour prédire l\'absentéisme et optimiser la planification des ressources.',
      icon: <Brain className="roadmap-icon" />,
      status: 'À venir',
      features: ['Prédiction turn-over', 'Optimisation planning IA', 'Chatbot RH 24/7']
    },
    {
      quarter: 'Q4 2026',
      title: 'Écosystème Connecté',
      description: 'Ouverture de l\'API pour intégration avec les ERP majeurs (SAP, Oracle) et automatisation complète de la paie externe.',
      icon: <Globe className="roadmap-icon" />,
      status: 'À venir',
      features: ['API Rest Publique', 'Connecteurs ERP standards', 'Portail Partenaires']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Rocket size={32} color="var(--primary)" />
            <h1>Roadmap Futur</h1>
          </div>
          <p className="page-subtitle">Vision Technologique & Évolutions 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ padding: '20px 0' }}>
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="section-card"
            style={{ marginBottom: 30, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{
              position: 'absolute', top: 0, right: 0,
              background: 'var(--primary-glow)', padding: '8px 24px',
              borderBottomLeftRadius: 16, color: 'var(--primary)',
              fontWeight: 800, fontSize: 14
            }}>
              {milestone.quarter}
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: 'var(--bg-body)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, border: '1px solid var(--border)'
              }}>
                {milestone.icon}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>{milestone.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 20, maxWidth: '800px', lineHeight: 1.6 }}>
                  {milestone.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {milestone.features.map((feature, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
                      <CheckCircle2 size={16} color="var(--success)" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: index === 0 ? 'var(--primary)' : 'var(--text-muted)' }}></div>
                   <span style={{ fontSize: 12, fontWeight: 600, color: index === 0 ? 'var(--primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                     <Timer size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                     Statut: {milestone.status}
                   </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="section-card" style={{
        background: 'linear-gradient(135deg, var(--primary), #4f46e5)',
        color: 'white', textAlign: 'center', padding: '40px'
      }}>
        <h2 style={{ color: 'white', marginBottom: 12 }}>Votre avis compte !</h2>
        <p style={{ opacity: 0.9, marginBottom: 24 }}>Suggérez-nous des fonctionnalités pour améliorer votre quotidien au travail.</p>
        <button className="btn-primary" style={{ background: 'white', color: 'var(--primary)', border: 'none' }}>
          Soumettre une idée
        </button>
      </div>
    </div>
  );
};

export default RoadmapPage;
