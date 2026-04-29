const { Move } = require('../models/Move');

// GET /api/moves — kaikki liikkeet (default + käyttäjän omat)
exports.getMoves = async (req, res) => {
  try {
    let filter = { createdBy: null };

    // Jos käyttäjä on tunnistettu headerista,  palautetaan myös hänen omat liikkeensä
    if (req.user && req.user.googleId) {
      filter = {
        $or: [{ createdBy: null }, { createdBy: req.user.googleId }],
      };
    }

    const moves = await Move.find(filter).sort({ name: 1 });
    res.json(moves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/moves/:id
exports.getMoveById = async (req, res) => {
  try {
    const move = await Move.findById(req.params.id);
    if (!move) {
      return res.status(404).json({ error: 'Liikettä ei löytynyt' });
    }
    res.json(move);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/moves — luo uusi liike
exports.createMove = async (req, res) => {
  try {
    const move = await Move.create({
      ...req.body,
      isDefault: false,
      createdBy: req.user?.googleId ?? null,
    });
    res.status(201).json(move);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: 'Samanniminen liike on jo olemassa' });
    }
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/moves/:id
exports.updateMove = async (req, res) => {
  try {
    const move = await Move.findById(req.params.id);
    if (!move) {
      return res.status(404).json({ error: 'Liikettä ei löytynyt' });
    }
    if (move.isDefault) {
      return res.status(403).json({ error: 'Default-liikettä ei voi muokata' });
    }
    const updated = await Move.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/moves/:id
exports.deleteMove = async (req, res) => {
  try {
    const move = await Move.findById(req.params.id);
    if (!move) {
      return res.status(404).json({ error: 'Liikettä ei löytynyt' });
    }
    if (move.isDefault) {
      return res.status(403).json({ error: 'Default-liikettä ei voi poistaa' });
    }
    await move.deleteOne();
    res.json({ message: 'Liike poistettu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
