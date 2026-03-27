import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      title: "📱 Application Mobile",
      status: "En développement",
      description: "Application native pour iOS et Android permettant aux employés de pointer via géolocalisation et de consulter leurs fiches de paie.",
      icon: "📱",
      color: "var(--primary)"
    },
    {
      title: "🧬 Intégration Biométrique",
      status: "Planifié",
      description: "Support des lecteurs d'empreintes digitales et reconnaissance faciale pour une sécurité accrue lors des pointages physiques.",
      icon: "🧬",
      color: "var(--secondary)"
    },
    {
      title: "🤖 Prédictions IA",
      status: "Recherche",
      description: "Utilisation du Machine Learning pour prédire les risques d'absentéisme et optimiser la planification des ressources.",
      icon: "🤖",
      color: "var(--accent)"
    },
    {
      title: "📄 Rapports PDF Automatisés",
      status: "En cours",
      description: "Génération automatique et envoi par email des rapports mensuels de performance et de présence.",
      icon: "📧",
      color: "var(--success)"
    },
    {
      title: "💰 Intégration Comptable",
      status: "Backlog",
      description: "Export direct des données de paie vers les logiciels de comptabilité standards (Sage, SAP, etc.).",
      icon: "🏦",
      color: "var(--warning)"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Découvrez les prochaines évolutions de votre plateforme RH</p>
        </div>
      </div>

      <div className="stats-box" style={{ marginBottom: 32 }}>
        <p>Notre vision est de transformer la gestion des ressources humaines par l'innovation technologique, en rendant les processus plus fluides, transparents et intelligents.</p>
      </div>

      <div className="form-sections-container">
        {milestones.map((m, i) => (
          <div key={i} className="section-card animate-slide-in" style={{
            animationDelay: `${i * 0.1}s`,
            borderLeft: `5px solid ${m.color}`,
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'start' }}>
              <div style={{
                fontSize: 32,
                background: `${m.color}15`,
                padding: 15,
                borderRadius: 12,
                minWidth: 70,
                textAlign: 'center'
              }}>
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{m.title}</h3>
                  <span className="badge" style={{
                    background: `${m.color}20`,
                    color: m.color,
                    border: `1px solid ${m.color}40`
                  }}>
                    {m.status}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{m.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 20, textAlign: 'center', background: 'var(--primary-glow)' }}>
        <h3>💡 Une idée ?</h3>
        <p>Nous sommes à l'écoute de nos utilisateurs. Si vous avez des suggestions pour améliorer l'application, n'hésitez pas à contacter l'équipe technique.</p>
        <button className="btn-primary">Suggérer une fonctionnalité</button>
      </div>
    </div>
  );
};

export default RoadmapPage;
