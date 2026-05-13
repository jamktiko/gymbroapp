const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCalendarDates,
  getStats,
  setCommitment,
  resetCommitment
} = require('../controllers/usersController');

router.get('/:id', verifyToken, getUserById);
router.post('/', verifyToken, createUser);
router.patch('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.get('/:id/calendar', verifyToken, getCalendarDates);
router.get('/:id/stats', verifyToken, getStats);
router.post('/:id/commitment', verifyToken, setCommitment);
router.delete('/:id/commitment', verifyToken, resetCommitment);

module.exports = router;