const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getMoves,
  getMoveById,
  createMove,
  updateMove,
  deleteMove,
} = require('../controllers/movesController');

router.get('/', verifyToken, getMoves);
router.get('/:id', verifyToken, getMoveById);
router.post('/', verifyToken, createMove);
router.patch('/:id', verifyToken, updateMove);
router.delete('/:id', verifyToken, deleteMove);

module.exports = router;
