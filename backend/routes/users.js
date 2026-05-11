const express = require('express');
const router = express.Router();
const { getCalendarDates } = require('../controllers/usersController');
const verifyToken = require('../middleware/verifyToken');
const {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

router.get('/:id', verifyToken, getUserById);
router.post('/', verifyToken, createUser);
router.patch('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.get('/:id/calendar', verifyToken, getCalendarDates);

module.exports = router;
