import React from 'react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const sections = [
    {
      title: '✅ Terminé (Phase 1 & 2)',
      status: 'completed',
      items: [
        { title: 'Dashboard Admin & Super Admin', desc: 'Indicateurs clés de performance et statistiques en temps réel.' },
        { title: 'Gestion des Employés', desc: 'Système complet de gestion des dossiers personnels.' },
        { title: 'Suivi des Pointages', desc: 'Gestion des entrées, sorties, retards et absences.' },
        { title: 'Gestion des Congés', desc: 'Flux d\'approbation multiniveaux pour les demandes de congés.' },
        { title: 'Calcul de la Paie', desc: 'Moteur de calcul automatique des salaires et primes.' },
        { title: 'Journal d\'Audit', desc: 'Traçabilité complète des actions effectuées sur le système.' }
      ]
    },
    {
      title: '🚀 En cours (Phase 3)',
      status: 'in-progress',
      items: [
        { title: 'Scanner QR Intelligent', desc: 'Mode automatique avec détection intelligente entrée/sortie.' },
        { title: 'Rapports PDF & Excel', desc: 'Génération automatique de rapports détaillés pour la direction.' },
        { title: 'Gestion des Stagiaires', desc: 'Module dédié au suivi des stages et intégrations.' },
        { title: 'Notifications Temps Réel', desc: 'Alertes pour les retards et validations de congés.' }
      ]
    },
    {
      title: '🔮 Futur (Phase 4 & 5)',
      status: 'future',
      items: [
        { title: 'Application Mobile (iOS/Android)', desc: 'Accès employé et scanner mobile pour les sites distants.' },
        { title: 'Intégration Biométrique', desc: 'Connexion directe avec les pointeuses physiques ZKTeco.' },
        { title: 'Prédictions par IA', desc: 'Analyse prédictive de l\'absentéisme et optimisation des RH.' },
        { title: 'Portail Self-Service Avancé', desc: 'Signature électronique des documents et gestion de carrière.' },
        { title: 'Intégration Comptable', desc: 'Export direct vers les logiciels de comptabilité standard.' }
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🛣️ Roadmap Futur</h1>
          <p className="page-subtitle">Vision stratégique et évolution de la plateforme RH</p>
        </div>
      </div>

      <div className="roadmap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {sections.map((section, idx) => (
          <div key={idx} className={`section-card roadmap-section ${section.status}`} style={{ borderTop: `4px solid ${
            section.status === 'completed' ? '#10b981' : section.status === 'in-progress' ? '#6366f1' : '#f59e0b'
          }` }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {section.title}
            </h3>
            <div className="roadmap-items">
              {section.items.map((item, i) => (
                <div key={i} className="roadmap-item" style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  marginBottom: '16px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: '30px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)' }}>
        <h3>🎯 Notre Vision</h3>
        <p style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          Transformer la gestion des ressources humaines en une expérience fluide, transparente et axée sur la donnée.
          Chaque mise à jour nous rapproche d'un écosystème RH totalement intégré et automatisé.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
