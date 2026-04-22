const User = require('../models/User');

// GET /api/training-programs — haetaan kirjautuneen käyttäjän treeniohjelmat
exports.getPrograms = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    // Etsitään käyttäjä
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    res.json(user.trainingPrograms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/training-programs/:id
exports.getProgramById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    // Haetaan ohjelma alidokumenttien joukosta id:llä
    const program = user.trainingPrograms.id(req.params.id);

    if (!program) {
      return res.status(404).json({ error: 'Treeniohjelmaa ei löytynyt' });
    }
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/training-programs — luo uusi ohjelma käyttäjälle
// when creating a new program we literally put all moves whole JSON-objects inside moves[]
exports.createProgram = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    // Lisätään uusi ohjelma
    user.trainingPrograms.push(req.body);
    await user.save();

    // Palautetaan juuri luotu uusi ohjelma (viimeinen alkio taulukossa)
    const newProgram = user.trainingPrograms[user.trainingPrograms.length - 1];
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/training-programs/:id
exports.updateProgram = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    const program = user.trainingPrograms.id(req.params.id);
    if (!program) {
      return res.status(404).json({ error: 'Treeniohjelmaa ei löytynyt' });
    }
    // Päivitetään kentät (toimii kuin PATCH)
    program.set(req.body);
    await user.save();

    res.json(program);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/training-programs/:id
exports.deleteProgram = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    const program = user.trainingPrograms.id(req.params.id);
    if (!program) {
      return res.status(404).json({ error: 'Treeniohjelmaa ei löytynyt' });
    }

    program.deleteOne();
    await user.save();

    res.json({ message: 'Treeniohjelma poistettu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
