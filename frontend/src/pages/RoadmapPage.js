import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const futureFeatures = [
    {
      title: "📱 Application Mobile",
      description: "Une application dédiée pour iOS et Android permettant aux employés de pointer via géolocalisation et de consulter leurs documents RH en déplacement.",
      status: "Planifié",
      icon: "📱",
      progress: 10
    },
    {
      title: "🧬 Intégration Biométrique",
      description: "Support pour les lecteurs d'empreintes digitales et la reconnaissance faciale pour une sécurité accrue lors des pointages physiques.",
      status: "En Recherche",
      icon: "👤",
      progress: 5
    },
    {
      title: "📊 Rapports PDF Automatiques",
      description: "Génération et envoi automatique de rapports mensuels de performance et de présence aux chefs de service par email.",
      status: "En Développement",
      icon: "📄",
      progress: 40
    },
    {
      title: "🔔 Notifications Email & Push",
      description: "Système d'alertes en temps réel pour les demandes de congés, les validations de salaires et les rappels de pointage.",
      status: "Planifié",
      icon: "📧",
      progress: 20
    },
    {
      title: "🧠 Prédictions avec IA",
      description: "Analyse prédictive de l'absentéisme et optimisation de la planification des ressources basée sur l'historique des données.",
      status: "Concept",
      icon: "🤖",
      progress: 5
    },
    {
      title: "💰 Intégration Comptable",
      description: "Export direct des données de paie vers les logiciels de comptabilité standards (Sage, SAP, etc.).",
      status: "Planifié",
      icon: "🏦",
      progress: 15
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Découvrez les prochaines évolutions de votre plateforme RH</p>
        </div>
        <div className="badge badge-primary" style={{ padding: '8px 16px' }}>
          Version 2.0 en préparation
        </div>
      </div>

      <div className="grid-2">
        {futureFeatures.map((feature, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
              <span style={{ fontSize: '24px' }}>{feature.icon}</span>
              <span className={`badge ${
                feature.status === 'En Développement' ? 'badge-info' :
                feature.status === 'Planifié' ? 'badge-primary' :
                'badge-neutral'
              }`}>
                {feature.status}
              </span>
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: 20, minHeight: '60px' }}>
              {feature.description}
            </p>
            <div className="kpi-progress">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                <span className="fw-bold">Progression</span>
                <span>{feature.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${feature.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card mt-6" style={{ background: 'var(--grad-primary)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: '40px' }}>💡</div>
          <div>
            <h2 style={{ color: 'white', margin: 0 }}>Vous avez une suggestion ?</h2>
            <p style={{ opacity: 0.9, margin: '5px 0 0 0' }}>
              Nous construisons cet outil pour vous. N'hésitez pas à contacter l'équipe technique pour proposer de nouvelles fonctionnalités.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
