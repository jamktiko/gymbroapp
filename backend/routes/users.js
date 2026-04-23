const express = require('express');
const router = express.Router();
const {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
