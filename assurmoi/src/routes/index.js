const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const sinisterRoutes = require('./sinister.routes');
const requestRoutes = require('./request.routes');
const documentRoutes = require('./document.routes');

// Préfixes des API
router.use('/users', userRoutes);
router.use('/sinisters', sinisterRoutes);
router.use('/requests', requestRoutes);
router.use('/documents', documentRoutes);

module.exports = router;