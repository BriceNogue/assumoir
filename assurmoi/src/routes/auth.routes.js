const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// Routes publiques.
router.post('/login', authService.login);

// Routes protégées.
router.post('/change-password', protect, authService.changePassword);

module.exports = router;