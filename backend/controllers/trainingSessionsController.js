const User = require('../models/User');

// GET /api/training-sessions — haetaan kirjautuneen käyttäjän treenisessiot
exports.getSessions = async (req, res) => {
  try {
    if (!req.user || !req.user.googleId) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    // Etsitään käyttäjä
    const user = await User.findOne({ googleId: req.user.googleId }).populate(
      'trainingSessions.exercises.move',
    );
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    let sessions = user.trainingSessions;

    // Valinnainen aikarajaus: ?from=2024-01-01&to=2024-12-31
    const { from, to } = req.query;
    if (from || to) {
      sessions = sessions.filter((session) => {
        let isValid = true;
        if (from) isValid = isValid && session.datetime >= new Date(from);
        if (to) isValid = isValid && session.datetime <= new Date(to);
        return isValid;
      });
    }

    // Järjestetään uusin ensin
    sessions.sort((a, b) => b.datetime - a.datetime);

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/training-sessions/:id
exports.getSessionById = async (req, res) => {
  try {
    if (!req.user || !req.user.googleId) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    const user = await User.findOne({ googleId: req.user.googleId }).populate(
      'trainingSessions.exercises.move',
    );
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    // Haetaan sessio alidokumenttien joukosta id:llä
    const session = user.trainingSessions.id(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Treenisessiota ei löytynyt' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/training-sessions — luo uusi sessio käyttäjälle
exports.createSession = async (req, res) => {
  try {
    if (!req.user || !req.user.googleId) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    const user = await User.findOne({ googleId: req.user.googleId });
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    // Lisätään uusi sessio
    user.trainingSessions.push(req.body);
    user.xp += 50; // XP:n lisäys uudesta sessiosta
    await user.save();

    // Palautetaan juuri luotu uusi sessio (viimeinen alkio taulukossa)
    const newSession = user.trainingSessions[user.trainingSessions.length - 1];

    // Populoidaan palautettava sessio
    await user.populate('trainingSessions.exercises.move');

    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/training-sessions/:id
exports.updateSession = async (req, res) => {
  try {
    if (!req.user || !req.user.googleId) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    const user = await User.findOne({ googleId: req.user.googleId });
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    const session = user.trainingSessions.id(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Treenisessiota ei löytynyt' });
    }

    // Päivitetään kentät (toimii kuin PATCH)
    session.set(req.body);
    await user.save();

    await user.populate('trainingSessions.exercises.move');

    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/training-sessions/:id
exports.deleteSession = async (req, res) => {
  try {
    if (!req.user || !req.user.googleId) {
      return res.status(401).json({ error: 'Ei oikeuksia' });
    }

    const user = await User.findOne({ googleId: req.user.googleId });
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    const session = user.trainingSessions.id(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Treenisessiota ei löytynyt' });
    }

    session.deleteOne();
    await user.save();

    res.json({ message: 'Treenisessio poistettu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
