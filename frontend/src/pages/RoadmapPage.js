import React from 'react';
import { Rocket, Target, Zap, Shield, Globe, Cpu } from 'lucide-react';
import '../styles/Dashboard.css';

const RoadmapPage = () => {
  const milestones = [
    {
      quarter: '2026 Q1',
      title: 'Système QR v2',
      description: 'Déploiement des bornes physiques avec scanner infrarouge et synchronisation temps réel haute disponibilité.',
      icon: <Zap size={24} />,
      status: 'En cours',
      features: ['Scanner QR Haute Précision', 'Offline Sync', 'Gestion des bornes']
    },
    {
      quarter: '2026 Q2',
      title: 'Application Mobile Native',
      description: 'Lancement des applications iOS et Android pour les employés (Pointage géolocalisé, Notifications Push).',
      icon: <Globe size={24} />,
      status: 'Planifié',
      features: ['Géofencing', 'Notifications Push', 'Self-service RH']
    },
    {
      quarter: '2026 Q3',
      title: 'Analytiques IA & Prédictions',
      description: 'Intégration d\'algorithmes prédictifs pour anticiper l\'absentéisme et optimiser la planification.',
      icon: <Cpu size={24} />,
      status: 'Recherche',
      features: ['Prédiction d\'absentéisme', 'Optimisation planning', 'Tableaux de bord IA']
    },
    {
      quarter: '2026 Q4',
      title: 'Intégration ERP Totale',
      description: 'Connecteurs natifs pour SAP, Oracle et Microsoft Dynamics pour une gestion unifiée.',
      icon: <Shield size={24} />,
      status: 'Planifié',
      features: ['Connecteur SAP/Oracle', 'Export Comptable Auto', 'API Unifiée']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Rocket className="primary-color" size={32} />
            <h1>Roadmap Futur</h1>
          </div>
          <p className="page-subtitle">Découvrez les prochaines étapes de l'évolution de notre plateforme HR Manager</p>
        </div>
      </div>

      <div className="roadmap-timeline" style={{ padding: '20px 0' }}>
        {milestones.map((ms, index) => (
          <div key={index} className="section-card animate-fade-in" style={{ marginBottom: '30px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              background: ms.status === 'En cours' ? 'var(--primary-glow)' : 'var(--bg-body)',
              color: ms.status === 'En cours' ? 'var(--primary)' : 'var(--text-muted)',
              border: '1px solid var(--border)'
            }}>
              {ms.status}
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'var(--primary-glow)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {ms.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>
                  {ms.quarter}
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{ms.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '15px', lineHeight: '1.6' }}>
                  {ms.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {ms.features.map((f, i) => (
                    <span key={i} style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      background: 'rgba(99, 102, 241, 0.05)',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Target size={12} /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Rocket size={48} style={{ opacity: 0.3 }} />
        </div>
        <h2>Vers une gestion RH 4.0</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
          Notre vision est de transformer radicalement la gestion du capital humain en utilisant les technologies
          les plus avancées pour simplifier le quotidien des RH et des collaborateurs.
        </p>
      </div>
    </div>
  );
};

export default RoadmapPage;
