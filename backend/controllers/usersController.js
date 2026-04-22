const User = require('../models/User');

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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
    res.status(201).json(user);
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
    // Suojataan level ja exp suoralta muokkaukselta (lisätään logiikka myöhemmin)
    const { level, exp, ...safeFields } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, safeFields, {
      new: true,
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
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }
    res.json({ message: 'Käyttäjä poistettu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
