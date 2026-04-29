const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  startFromProgram,
} = require('../controllers/trainingSessionsController');

router.get('/',verifyToken, getSessions);
router.post('/from-program/:programId', verifyToken, startFromProgram);
router.get('/:id',verifyToken, getSessionById);
router.post('/',verifyToken, createSession);
router.patch('/:id',verifyToken, updateSession);
router.delete('/:id',verifyToken, deleteSession);

module.exports = router;
