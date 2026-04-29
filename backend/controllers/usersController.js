const User = require('../models/User');
const {
  fetchDefaultProgramsForUser,
} = require('../controllers/trainingProgramsController');

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users — luo uusi käyttäjä (myöhemmin Google Auth hoitaa tämän)
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    // fetch default training programs for newly created user:
    const updatedUser = await fetchDefaultProgramsForUser(user.googleId);
    res.status(201).json(updatedUser);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Sähköposti on jo käytössä' });
    }
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/users/:id — päivitä käyttäjä (esim. weightUnit)
exports.updateUser = async (req, res) => {
  try {
    if (req.user.googleId !== req.params.id) {
      return res.status(403).json({ error: 'Ei oikeuksia muokata toista käyttäjää' });
    }
    // Suojataan level ja exp suoralta muokkaukselta (lisätään logiikka myöhemmin)
    const { ...safeFields } = req.body;
    const user = await User.findOneAndUpdate({ googleId: req.params.id }, safeFields, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.googleId !== req.params.id) {
      return res.status(403).json({ error: 'Ei oikeuksia poistaa toista käyttäjää' });
    }
    const user = await User.findOneAndDelete({ googleId: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }
    res.json({ message: 'Käyttäjä poistettu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
