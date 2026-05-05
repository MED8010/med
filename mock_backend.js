
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  res.json({
    token: 'mock_token',
    user: {
      id: '1',
      email: 'admin@rh.app',
      role: 'admin',
      employe: { prenom: 'Admin', nom: 'User' }
    }
  });
});

app.get('/api/notifications', (req, res) => {
  res.json({ unreadCount: 0, notifications: [] });
});

app.get('/api/employes/matricule/:matricule', (req, res) => {
  res.json({
    _id: 'emp1',
    matricule: req.params.matricule,
    prenom: 'Jean',
    nom: 'Dupont',
    service: { nom_service: 'Informatique' },
    poste: 'Développeur'
  });
});

app.post('/api/pointages', (req, res) => {
  res.json({
    message: 'Pointage enregistré',
    effectiveAction: req.body.scanner_action === 'auto' ? 'entree' : req.body.scanner_action
  });
});

app.get('/api/structure/services', (req, res) => res.json([]));
app.get('/api/structure/uaps', (req, res) => res.json([]));
app.get('/api/employes/stats', (req, res) => res.json({}));
app.get('/api/pointages/stats/time-stats', (req, res) => res.json({}));
app.get('/api/salaires/stats/analytics', (req, res) => res.json({}));

app.listen(5000, () => console.log('Mock backend running on port 5000'));
