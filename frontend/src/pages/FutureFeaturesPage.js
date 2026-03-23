import React from 'react';
import '../styles/Dashboard.css';

const FutureFeaturesPage = () => {
  const roadmaps = [
    { title: "📱 Application Mobile", desc: "Version mobile native pour iOS et Android.", status: "Planifié" },
    { title: "🧬 Biométrie", desc: "Intégration avec des pointeuses biométriques physiques.", status: "Recherche" },
    { title: "📄 PDF Automatisés", desc: "Génération et envoi automatique de rapports mensuels.", status: "En cours" },
    { title: "📧 Notifications Email", desc: "Alertes email pour les retards et validations de congés.", status: "Planifié" },
    { title: "🤖 IA & Prédictions", desc: "Analyse prédictive de l'absentéisme et de la masse salariale.", status: "Planifié" },
    { title: "🏦 Comptabilité", desc: "Export direct vers les logiciels de comptabilité standards.", status: "Recherche" }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Feuille de Route & Développement</h1>
          <p className="page-subtitle">Vision future de l'application RH</p>
        </div>
      </div>

      <div className="grid-3">
        {roadmaps.map((feature, index) => (
          <div key={index} className="section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: 15 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
            <div style={{ marginTop: 20 }}>
              <span className={`badge ${feature.status === 'En cours' ? 'badge-warning' : 'badge-neutral'}`}>
                {feature.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 30 }}>
        <h3>💡 Pourquoi ces évolutions ?</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 800 }}>
          Notre objectif est de transformer cet outil en une plateforme 360° pour la gestion des talents.
          En automatisant les tâches à faible valeur ajoutée, nous permettons aux équipes RH de se concentrer
          sur l'essentiel : l'humain.
        </p>
      </div>
    </div>
  );
};

export default FutureFeaturesPage;
