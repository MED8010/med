const express = require('express');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const {
  createStageRequest,
  getMyStageRequests,
  getAllStageRequests,
  approveStageRequest,
  rejectStageRequest
} = require('../controllers/stageController');

const router = express.Router();

// Routes protégées - Employé crée sa demande
router.post('/', verifyToken, createStageRequest);
router.get('/my-requests', verifyToken, getMyStageRequests);

// Routes protégées - Admin/Chef voit toutes les demandes
router.get('/', verifyToken, checkRole(['admin', 'chef_service', 'super_admin']), getAllStageRequests);
router.put('/:id/approve', verifyToken, checkRole(['admin', 'chef_service', 'super_admin']), approveStageRequest);
router.put('/:id/reject', verifyToken, checkRole(['admin', 'chef_service', 'super_admin']), rejectStageRequest);

module.exports = router;

