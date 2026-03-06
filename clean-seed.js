const mongoose = require('mongoose');
require('dotenv').config();

const cleanDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connecté à MongoDB');

    // Nettoyer toutes les collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log('✓ Base de données nettoyée');

    // Recharger les modèles
    const User = require('./backend/models/User');
    const Employe = require('./backend/models/Employe');
    const Service = require('./backend/models/Service');
    const UAP = require('./backend/models/UAP');

    // Créer les services
    const services = await Service.insertMany([
      { nom_service: 'Informatique', description: 'Département Informatique' },
      { nom_service: 'Ressources Humaines', description: 'Département RH' },
      { nom_service: 'Finance', description: 'Département Finance' },
      { nom_service: 'Ventes', description: 'Département Ventes' },
      { nom_service: 'Production', description: 'Département Production' },
    ]);
    console.log('✓ Services créés');

    // Créer les UAPs
    const uaps = await UAP.insertMany([
      { nom_uap: 'UAP 1 - Nord', description: 'Unité Administrative et Pédagogique Nord' },
      { nom_uap: 'UAP 2 - Centre', description: 'Unité Administrative et Pédagogique Centre' },
      { nom_uap: 'UAP 3 - Sud', description: 'Unité Administrative et Pédagogique Sud' },
    ]);
    console.log('✓ UAPs créées');

    // Créer un employé admin
    const adminEmploye = await Employe.create({
      matricule: 'ADM001',
      nom: 'Admin',
      prenom: 'Système',
      date_embauche: new Date('2024-01-01'),
      prix_heure: 500,
      service: services[1]._id,
      uap: uaps[0]._id,
      email: 'admin@rh.app',
      solde_conge_total: 22,
      solde_conge_restant: 22,
      statut: 'actif',
    });
    console.log('✓ Employé Admin créé');

    // Créer un utilisateur admin
    const adminUser = await User.create({
      email: 'admin@rh.app',
      password: 'admin123456',
      role: 'admin',
      employe: adminEmploye._id,
    });
    console.log('✓ Utilisateur Admin créé');

    // Créer des employés de test
    const employes = await Employe.insertMany([
      {
        matricule: 'EMP001',
        nom: 'Dupont',
        prenom: 'Jean',
        date_embauche: new Date('2023-01-15'),
        prix_heure: 350,
        service: services[0]._id,
        uap: uaps[0]._id,
        email: 'jean.dupont@rh.app',
        solde_conge_total: 22,
        solde_conge_restant: 20,
        statut: 'actif',
      },
      {
        matricule: 'EMP002',
        nom: 'Martin',
        prenom: 'Marie',
        date_embauche: new Date('2023-06-01'),
        prix_heure: 300,
        service: services[3]._id,
        uap: uaps[1]._id,
        email: 'marie.martin@rh.app',
        solde_conge_total: 22,
        solde_conge_restant: 22,
        statut: 'actif',
      },
      {
        matricule: 'EMP003',
        nom: 'Bernard',
        prenom: 'Pierre',
        date_embauche: new Date('2024-01-10'),
        prix_heure: 320,
        service: services[2]._id,
        uap: uaps[2]._id,
        email: 'pierre.bernard@rh.app',
        solde_conge_total: 22,
        solde_conge_restant: 18,
        statut: 'actif',
      },
    ]);
    console.log('✓ Employés de test créés');

    // Créer les comptes pour les employés
    await User.create({
      email: 'jean.dupont@rh.app',
      password: 'emp123456',
      role: 'employe',
      employe: employes[0]._id,
    });
    console.log('✓ Compte Employé 1 créé');

    await User.create({
      email: 'marie.martin@rh.app',
      password: 'emp123456',
      role: 'employe',
      employe: employes[1]._id,
    });
    console.log('✓ Compte Employé 2 créé');

    console.log('\n✅ Base de données réinitialisée avec succès!\n');
    console.log('========== COMPTES DE TEST ==========');
    console.log('Admin:');
    console.log('  Email: admin@rh.app');
    console.log('  Mot de passe: admin123456');
    console.log('\nEmployé 1:');
    console.log('  Email: jean.dupont@rh.app');
    console.log('  Mot de passe: emp123456');
    console.log('\nEmployé 2:');
    console.log('  Email: marie.martin@rh.app');
    console.log('  Mot de passe: emp123456');
    console.log('=====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Erreur:', error.message);
    process.exit(1);
  }
};

cleanDatabase();
