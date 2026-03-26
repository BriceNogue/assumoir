const express = require('express');
const router = express.Router();
const docService = require('../services/document.service');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.use(protect);

router.post('/upload', docService.uploadDocument);

router.patch('/:id/validate', 
    restrictTo('GESTIONNAIRE', 'ADMIN'), 
    docService.validateDocument
);

module.exports = router;