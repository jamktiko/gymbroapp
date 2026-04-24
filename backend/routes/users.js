const express = require('express');
const router = express.Router();
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

module.exports = router;
