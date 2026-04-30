const express = require('express');
const router = express.Router();
const { authenticateGoogleUser } = require('../controllers/authController');

router.post('/google', authenticateGoogleUser);

module.exports = router;
