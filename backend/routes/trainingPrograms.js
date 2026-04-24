const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} = require('../controllers/trainingProgramsController');

router.get('/', verifyToken, getPrograms);
router.get('/:id',verifyToken, getProgramById);
router.post('/',verifyToken, createProgram);
router.patch('/:id',verifyToken, updateProgram);
router.delete('/:id',verifyToken, deleteProgram);

module.exports = router;
