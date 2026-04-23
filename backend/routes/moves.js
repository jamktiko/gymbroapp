const express = require('express');
const router = express.Router();
const {
  getMoves,
  getMoveById,
  createMove,
  updateMove,
  deleteMove,
} = require('../controllers/movesController');

router.get('/', getMoves);
router.get('/:id', getMoveById);
router.post('/', createMove);
router.patch('/:id', updateMove);
router.delete('/:id', deleteMove);

module.exports = router;
