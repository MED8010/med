import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapItems = [
    {
      quarter: 'Q2 2026',
      status: 'upcoming',
      title: '📱 Application Mobile Dédiée',
      description: 'Développement d\'une application mobile native pour iOS et Android permettant aux employés de consulter leurs informations en déplacement.',
      features: ['Notifications Push', 'Consultation fiches de paie mobile', 'Demandes de congés simplifiées']
    },
    {
      quarter: 'Q3 2026',
      status: 'upcoming',
      title: '🧬 Intégration Biométrique',
      description: 'Connexion directe avec les pointeuses biométriques physiques pour une synchronisation automatique des données de présence.',
      features: ['Sync temps réel', 'Support multimarques', 'Détection de fraude']
    },
    {
      quarter: 'Q4 2026',
      status: 'planning',
      title: '🤖 Intelligence Artificielle RH',
      description: 'Utilisation du Machine Learning pour prédire l\'absentéisme et optimiser la planification des ressources.',
      features: ['Prédiction de turnover', 'Optimisation des shifts', 'Chatbot RH intelligent']
    },
    {
      quarter: 'Q1 2027',
      status: 'planning',
      title: '📊 Module Analytique Avancé',
      description: 'Nouveaux tableaux de bord interactifs avec des indicateurs de performance RH avancés et exportations personnalisables.',
      features: ['Business Intelligence', 'Rapports réglementaires auto', 'Comparaison inter-services']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🚀 Roadmap Futur</h1>
          <p className="page-subtitle">Découvrez les prochaines évolutions de votre plateforme RH</p>
        </div>
      </div>

      <div className="form-section">
        <h3>🎯 Vision Stratégique</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          Notre objectif est de transformer la gestion des ressources humaines en une expérience fluide, data-driven et centrée sur l'humain.
          Voici les jalons que nous prévoyons pour les mois à venir.
        </p>

        <div style={{ position: 'relative', paddingLeft: 30, borderLeft: '2px solid var(--border)' }}>
          {roadmapItems.map((item, index) => (
            <div key={index} className="animate-slide-in" style={{
              marginBottom: 40,
              position: 'relative',
              animationDelay: `${index * 0.1}s`
            }}>
              <div style={{
                position: 'absolute',
                left: -41,
                top: 0,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: item.status === 'upcoming' ? 'var(--primary)' : 'var(--bg-card)',
                border: '4px solid var(--border)',
                zIndex: 1
              }}></div>

              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className={`badge ${item.status === 'upcoming' ? 'badge-primary' : 'badge-neutral'}`}>
                    {item.quarter}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {item.status === 'upcoming' ? 'En développement' : 'En planification'}
                  </span>
                </div>

                <h2 style={{ fontSize: 18, marginBottom: 10 }}>{item.title}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 15 }}>{item.description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {item.features.map((feature, fIdx) => (
                    <span key={fIdx} style={{
                      fontSize: 11,
                      padding: '4px 8px',
                      background: 'var(--bg-hover)',
                      borderRadius: 4,
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)'
                    }}>
                      • {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card" style={{ background: 'var(--grad-primary)', color: 'white' }}>
        <h3 style={{ color: 'white' }}>💡 Vous avez une suggestion ?</h3>
        <p style={{ opacity: 0.9, marginBottom: 15 }}>
          Nous construisons cette plateforme pour vous. Si vous avez des idées de fonctionnalités qui pourraient améliorer votre quotidien, n'hésitez pas à nous en faire part.
        </p>
        <button className="btn-secondary" style={{ background: 'white', color: 'var(--primary)', border: 'none' }}>
          Suggérer une fonctionnalité
        </button>
      </div>
    </div>
  );
};

export default RoadmapPage;
