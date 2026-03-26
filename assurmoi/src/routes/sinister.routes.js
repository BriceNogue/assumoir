const express = require('express');
const router = express.Router();
const sinisterService = require('../services/sinister.service');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.use(protect);

router.get('/', sinisterService.getAllSinisters);

router.post('/', restrictTo('CHARGE_CLIENTELE', 'ADMIN'), sinisterService.createSinister);

router.put('/:id', restrictTo('GESTIONNAIRE', 'ADMIN'), sinisterService.updateSinister);

module.exports = router;