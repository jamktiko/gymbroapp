const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} = require('../controllers/trainingProgramsController');

router.get('/', getPrograms);
router.get('/:id', getProgramById);
router.post('/', createProgram);
router.put('/:id', updateProgram);
router.delete('/:id', deleteProgram);

module.exports = router;