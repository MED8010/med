import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Système QR v2 & Biométrie',
      description: 'Déploiement de la nouvelle génération de lecteurs QR et intégration optionnelle des pointeuses biométriques.',
      icon: '🔐'
    },
    {
      quarter: 'Q2 2026',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés (self-service, notifications push, géolocalisation).',
      icon: '📱'
    },
    {
      quarter: 'Q3 2026',
      title: 'Analytiques IA & Prédictions',
      description: 'Utilisation de l\'IA pour prédire les besoins en recrutement et analyser les tendances d\'absentéisme.',
      icon: '🧠'
    },
    {
      quarter: 'Q4 2026',
      title: 'Intégration ERP Totale',
      description: 'Synchronisation bidirectionnelle avec les principaux ERP du marché (SAP, Oracle, Microsoft Dynamics).',
      icon: '🏢'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolutions du système pour 2026</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {milestones.map((ms, index) => (
          <div key={index} className="roadmap-item">
            <div className="roadmap-dot"></div>
            <div className="roadmap-content">
              <div className="roadmap-date">{ms.quarter}</div>
              <h4>{ms.icon} {ms.title}</h4>
              <p>{ms.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 40, background: 'var(--grad-primary)', color: 'white', border: 'none' }}>
        <h3 style={{ color: 'white' }}>💡 Notre Vision</h3>
        <p style={{ opacity: 0.9, fontSize: 15, lineHeight: 1.8 }}>
          Nous nous engageons à transformer la gestion RH par l'innovation technologique.
          Notre objectif est de créer un écosystème fluide où les données servent l'humain,
          en automatisant les tâches répétitives pour permettre aux équipes RH de se concentrer
          sur l'essentiel : le développement des talents et la culture d'entreprise.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
