import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const roadmapItems = [
    {
      title: 'Phase 1: Fondations RH (Terminé)',
      status: 'completed',
      date: 'Q4 2024',
      features: [
        'Gestion des employés et contrats',
        'Suivi des pointages et retards',
        'Gestion des congés (Workflow approbation)',
        'Système de paie basique'
      ]
    },
    {
      title: 'Phase 2: Optimisation & Scanner (En cours)',
      status: 'current',
      date: 'Q1 2025',
      features: [
        'Scanner QR Code Haute Précision',
        'Mode automatique (Entrée/Sortie intelligente)',
        'Exportation de rapports PDF/Excel avancée',
        'Tableau de bord Temps & Discipline'
      ]
    },
    {
      title: 'Phase 3: Analytique & IA',
      status: 'planned',
      date: 'Q2 2025',
      features: [
        'IA de détection de patterns d\'absentéisme',
        'Analyse prédictive de la masse salariale',
        'Portail employé mobile (PWA)',
        'Génération automatique de fiches de poste'
      ]
    },
    {
      title: 'Phase 4: Expansion Système',
      status: 'planned',
      date: 'Q3 2025',
      features: [
        'Module de recrutement (ATS)',
        'Gestion des formations & compétences',
        'Évaluations de performance 360°',
        'Intégration API avec logiciels comptables'
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et prochaines étapes de l'évolution du système</p>
        </div>
      </div>

      <div className="section-card">
        <div style={{ display: 'grid', gap: '40px', padding: '20px 0' }}>
          {roadmapItems.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '30px',
              position: 'relative'
            }}>
              {/* Timeline line */}
              {index !== roadmapItems.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '22px',
                  top: '45px',
                  bottom: '-45px',
                  width: '2px',
                  background: 'var(--border)',
                  zIndex: 0
                }}></div>
              )}

              {/* Icon / Bullet */}
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: item.status === 'completed' ? 'var(--success)' :
                            item.status === 'current' ? 'var(--primary)' : 'var(--bg)',
                border: `3px solid ${item.status === 'planned' ? 'var(--border)' : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                zIndex: 1,
                flexShrink: 0,
                color: item.status === 'planned' ? 'var(--text-muted)' : 'white',
                boxShadow: item.status === 'current' ? '0 0 15px var(--primary-glow)' : 'none'
              }}>
                {item.status === 'completed' ? '✓' : index + 1}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{item.title}</h3>
                  <span className={`badge ${
                    item.status === 'completed' ? 'badge-success' :
                    item.status === 'current' ? 'badge-primary' : 'badge-neutral'
                  }`}>
                    {item.date}
                  </span>
                </div>

                <div className="grid-2" style={{ gap: '15px' }}>
                  {item.features.map((feature, fIdx) => (
                    <div key={fIdx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 15px',
                      background: 'var(--bg-hover)',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}>
                      <span style={{ color: item.status === 'completed' ? 'var(--success)' : 'var(--primary)' }}>●</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
