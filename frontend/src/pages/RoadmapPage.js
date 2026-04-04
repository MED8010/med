import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const futureFeatures = [
    {
      title: '📱 Application Mobile',
      description: 'Version native pour iOS et Android pour permettre aux employés de consulter leurs informations en déplacement.',
      status: 'planned',
      icon: '📱'
    },
    {
      title: '🧬 Intégration Biométrique',
      description: 'Support des lecteurs d\'empreintes digitales et de reconnaissance faciale pour une sécurité accrue du pointage.',
      status: 'planned',
      icon: '🧬'
    },
    {
      title: '📄 Rapports PDF Automatiques',
      description: 'Génération et envoi automatique de rapports RH hebdomadaires et mensuels par email aux administrateurs.',
      status: 'in-progress',
      icon: '📄'
    },
    {
      title: '🔔 Notifications Email & SMS',
      description: 'Système d\'alertes en temps réel pour les retards critiques, les approbations de congés et les rappels de fin de contrat.',
      status: 'planned',
      icon: '🔔'
    },
    {
      title: '🤖 Prédictions avec IA',
      description: 'Utilisation du Machine Learning pour prédire les tendances d\'absentéisme et optimiser la planification des effectifs.',
      status: 'planned',
      icon: '🤖'
    },
    {
      title: '📊 Intégration Comptable',
      description: 'Exportation directe des données de paie vers les logiciels de comptabilité standards (Sage, SAP, etc.).',
      status: 'planned',
      icon: '📊'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Découvrez les prochaines innovations de votre plateforme RH</p>
        </div>
      </div>

      <div className="section-card" style={{ marginBottom: 30, background: 'var(--grad-primary)', color: 'white' }}>
        <h2 style={{ color: 'white', margin: 0 }}>🚀 Vision 2026</h2>
        <p style={{ opacity: 0.9, marginTop: 10, maxWidth: 800 }}>
          Notre mission est de transformer la gestion des ressources humaines en une expérience fluide,
          automatisée et intelligente. Voici les fonctionnalités majeures sur lesquelles notre équipe travaille.
        </p>
      </div>

      <div className="grid-2">
        {futureFeatures.map((feature, index) => (
          <div key={index} className="kpi-card" style={{ cursor: 'default' }}>
            <div className="kpi-card-top">
              <div className="kpi-icon-box">
                {feature.icon}
              </div>
              <span className={`badge ${feature.status === 'in-progress' ? 'badge-info' : 'badge-neutral'}`}>
                {feature.status === 'in-progress' ? 'EN COURS' : 'PLANIFIÉ'}
              </span>
            </div>
            <div style={{ marginTop: 15 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 18 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                {feature.description}
              </p>
            </div>
            <div className="kpi-progress" style={{ marginTop: 'auto', paddingTop: 20 }}>
               <div className="progress-bar">
                  <div className="progress-fill" style={{ width: feature.status === 'in-progress' ? '35%' : '5%' }}></div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 30, textAlign: 'center' }}>
        <h3>💡 Vous avez une suggestion ?</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Nous construisons cette plateforme pour vous. Si vous avez des idées de fonctionnalités,
          n'hésitez pas à contacter notre équipe support.
        </p>
        <button className="btn-primary" style={{ marginTop: 15 }}>
          📧 Envoyer une suggestion
        </button>
      </div>
    </div>
  );
};

export default RoadmapPage;
