const express = require('express');
const router = express.Router();
const requestService = require('../services/request.service');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.use(protect);

// Consultation : Accessible par tous les rôles.
router.get('/:id', requestService.getRequest);

// Progression du dossier : Chargé de suivi, Gestionnaire ou Admin.
router.patch('/:id/status', 
    restrictTo('CHARGE_SUIVI', 'GESTIONNAIRE', 'ADMIN'), 
    requestService.updateRequestStatus
);

module.exports = router;