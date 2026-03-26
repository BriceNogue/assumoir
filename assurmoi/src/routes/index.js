const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const sinisterRoutes = require('./sinister.routes');
const requestRoutes = require('./request.routes');
const documentRoutes = require('./document.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sinisters', sinisterRoutes);
router.use('/requests', requestRoutes);
router.use('/documents', documentRoutes);

module.exports = router;