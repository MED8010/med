const mongoose = require('mongoose');
const Pointage = require('./backend/models/Pointage');
const Employe = require('./backend/models/Employe');
const { createPointage } = require('./backend/controllers/pointageController');
require('dotenv').config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_manager');
    console.log('Connected to DB');

    const employe = await Employe.findOne();
    if (!employe) {
      console.log('No employee found. Please seed the DB first.');
      process.exit(1);
    }

    const today = new Date();
    const serverDate = today.toISOString().split('T')[0];

    // Clean up today's pointage for this employee
    await Pointage.deleteOne({ employe: employe._id, date: new Date(serverDate) });
    console.log('Cleaned up today\'s pointage for employee:', employe.matricule);

    // Mock res
    const res = {
      status: function(s) { this.statusCode = s; return this; },
      json: function(j) { this.data = j; return this; }
    };

    // 1st Scan (Auto)
    console.log('--- 1st Scan (Auto) ---');
    await createPointage({ body: { employe_id: employe._id, scanner_action: 'auto' } }, res);
    console.log('Effective Action:', res.data.pointage.effectiveAction);
    console.log('Heure Entrée:', res.data.pointage.heure_entree);
    console.log('Heure Sortie:', res.data.pointage.heure_sortie);

    if (res.data.pointage.effectiveAction !== 'entree') throw new Error('1st scan should be entree');

    // 2nd Scan (Auto)
    console.log('--- 2nd Scan (Auto) ---');
    await createPointage({ body: { employe_id: employe._id, scanner_action: 'auto' } }, res);
    console.log('Effective Action:', res.data.pointage.effectiveAction);
    console.log('Heure Entrée:', res.data.pointage.heure_entree);
    console.log('Heure Sortie:', res.data.pointage.heure_sortie);

    if (res.data.pointage.effectiveAction !== 'sortie') throw new Error('2nd scan should be sortie');
    if (!res.data.pointage.heure_sortie) throw new Error('Heure sortie should be set');

    console.log('SUCCESS: Auto mode logic verified.');
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

test();
