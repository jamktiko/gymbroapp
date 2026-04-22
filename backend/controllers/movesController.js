const Move = require('../models/Move');

// GET /api/moves — kaikki liikkeet (default + käyttäjän omat)
exports.getMoves = async (req, res) => {
  try {
    const moves = await Move.find({
      $or: [{ isDefault: true }, { createdBy: req.user?.id }],
    }).sort({ name: 1 });
    res.json(moves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/moves/:id
exports.getMoveById = async (req, res) => {
  try {
    const move = await Move.findById(req.params.id);
    if (!move) return res.status(404).json({ error: 'Liikettä ei löydy' });
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
      createdBy: req.user?.id ?? null,
    });
    res.status(201).json(move);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Samanniminen liike on jo olemassa' });
    }
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/moves/:id
exports.updateMove = async (req, res) => {
  try {
    const move = await Move.findById(req.params.id);
    if (!move) return res.status(404).json({ error: 'Liikettä ei löydy' });
    if (move.isDefault) {
      return res.status(403).json({ error: 'Default-liikettä ei voi muokata' });
    }
    const updated = await Move.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
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
    if (!move) return res.status(404).json({ error: 'Liikettä ei löydy' });
    if (move.isDefault) {
      return res.status(403).json({ error: 'Default-liikettä ei voi poistaa' });
    }
    await move.deleteOne();
    res.json({ message: 'Liike poistettu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
