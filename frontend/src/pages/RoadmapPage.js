import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const features = [
    {
      title: "🚀 Phase 1: Fondations (Complété)",
      status: "Terminé",
      items: [
        "Gestion des employés (CRUD)",
        "Système de pointage numérique",
        "Calcul automatique des salaires",
        "Gestion des congés",
        "Journal d'audit complet"
      ]
    },
    {
      title: "📱 Phase 2: Mobilité & Scanner (En cours)",
      status: "Actif",
      items: [
        "Mode automatique pour le scanner QR",
        "Optimisation de l'interface mobile",
        "Système de notifications temps réel",
        "Amélioration de la sécurité NoSQL"
      ]
    },
    {
      title: "📊 Phase 3: Analytiques Avancées",
      status: "À venir",
      items: [
        "Prédiction de l'absentéisme via IA",
        "Tableaux de bord personnalisables",
        "Exportation de rapports PDF/Excel avancés",
        "Intégration avec les systèmes bancaires"
      ]
    },
    {
      title: "💡 Phase 4: Expansion",
      status: "Planifié",
      items: [
        "Portail candidat pour les recrutements",
        "Gestion de la formation et des compétences",
        "Évaluations de performance annuelles",
        "Module de gestion des frais professionnels"
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🗺️ Roadmap Futur</h1>
          <p className="page-subtitle">Vision et évolution de la plateforme RH</p>
        </div>
      </div>

      <div className="grid-2">
        {features.map((phase, index) => (
          <div key={index} className="section-card animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{phase.title}</h3>
              <span className={`badge ${
                phase.status === 'Terminé' ? 'badge-success' :
                phase.status === 'Actif' ? 'badge-primary' :
                'badge-neutral'
              }`}>
                {phase.status}
              </span>
            </div>
            <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)' }}>
              {phase.items.map((item, i) => (
                <li key={i} style={{ marginBottom: 10 }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="section-card mt-6">
        <h3>🎯 Objectif Final</h3>
        <p>
          Devenir la solution de référence pour la gestion du capital humain, en alliant simplicité
          d'utilisation et puissance d'analyse, tout en garantissant une traçabilité et une sécurité
          irréprochable des données.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
