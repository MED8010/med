import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Optimisation de l\'Infrastructure',
      description: 'Migration vers une architecture microservices pour une scalabilité accrue et temps de réponse ultra-rapides.',
      status: 'planned',
      icon: '🚀'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des versions iOS et Android avec notifications push temps réel et mode hors-ligne pour le pointage terrain.',
      status: 'planned',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Moteur d\'intelligence artificielle pour prédire les besoins en recrutement et détecter les risques d\'absentéisme.',
      status: 'planned',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une synchronisation financière bidirectionnelle.',
      status: 'planned',
      icon: '🔗'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions technologiques 2026</p>
        </div>
        <div style={{ background: 'var(--grad-primary)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: 600 }}>
          Version 3.0 Planning
        </div>
      </div>

      <div className="section-card" style={{ marginBottom: 30 }}>
        <h3>🎯 Objectif Global</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8 }}>
          Notre vision pour 2026 est de transformer <strong>HR Manager</strong> d'un outil de gestion administrative en une véritable
          plateforme d'intelligence stratégique. Nous nous concentrons sur la mobilité, l'intelligence artificielle et l'interopérabilité totale.
        </p>
      </div>

      <div className="roadmap-timeline" style={{ position: 'relative', paddingLeft: 30 }}>
        <div style={{
          position: 'absolute', left: 5, top: 0, bottom: 0,
          width: 2, background: 'var(--border)', zIndex: 0
        }}></div>

        {milestones.map((ms, index) => (
          <div key={index} className="animate-slide-in" style={{
            marginBottom: 30, position: 'relative',
            animationDelay: `${index * 0.1}s`
          }}>
            <div style={{
              position: 'absolute', left: -34, top: 0,
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--primary)', border: '4px solid var(--bg)',
              zIndex: 1
            }}></div>

            <div className="section-card" style={{ marginLeft: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="badge badge-primary" style={{ fontSize: 12 }}>{ms.quarter}</span>
                <span style={{ fontSize: 24 }}>{ms.icon}</span>
              </div>
              <h2 style={{ fontSize: 18, margin: '0 0 10px', color: 'var(--text-primary)' }}>{ms.title}</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>{ms.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="section-card" style={{ background: 'var(--success-bg)', borderColor: 'var(--success)' }}>
          <h3 style={{ color: 'var(--success)' }}>💡 Innovation</h3>
          <p style={{ fontSize: 13, margin: 0 }}>
            Utilisation du Deep Learning pour l'analyse du climat social basé sur les retours anonymisés des employés.
          </p>
        </div>
        <div className="section-card" style={{ background: 'var(--info-bg)', borderColor: 'var(--info)' }}>
          <h3 style={{ color: 'var(--info)' }}>🌍 Expansion</h3>
          <p style={{ fontSize: 13, margin: 0 }}>
            Support multi-devises et multi-législations pour accompagner votre croissance internationale.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
