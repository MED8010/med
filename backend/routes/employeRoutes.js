const express = require('express');
const { createEmploye, getEmployes, getEmploye, updateEmploye, deleteEmploye, getEmployeStats } = require('../controllers/employeController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const Employe = require('../models/Employe');

const router = express.Router();

router.post('/', verifyToken, checkRole(['admin']), createEmploye);
router.get('/', verifyToken, getEmployes);
router.get('/stats', verifyToken, checkRole(['admin']), getEmployeStats);
router.get('/matricule/:matricule', verifyToken, checkRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { matricule } = req.params;
    const employe = await Employe.findOne({ matricule }).populate(['service', 'uap']);
    if (!employe) return res.status(404).json({ message: 'Employé non trouvé' });
    res.json(employe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
router.get('/:id', verifyToken, getEmploye);
router.put('/:id', verifyToken, checkRole(['admin']), updateEmploye);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteEmploye);

module.exports = router;
