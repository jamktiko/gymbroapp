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

// GET /api/users/:id/stats
exports.getStats = async (req, res) => {
  try {
    if (req.user.googleId !== req.params.id) {
      return res.status(403).json({ error: 'Ei oikeuksia' });
    }
    const user = await User.findOne({ googleId: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }

    const muscleMap = {}; // { "Rinta": 24, "Selkä": 18, ... }
    const recordMap = {}; // { "Rinta": { exercise: "Penkkipunnerrus", weight: 85 }, ... }

    for (const session of user.trainingSessions) {
      for (const exercise of session.exercises) {
        const group = exercise.move.muscleGroup;
        const name = exercise.move.name;

        // Lihasryhmäjakauma: lasketaan harjoituskerrat
        muscleMap[group] = (muscleMap[group] || 0) + 1;

        // Personal records: etsitään korkein paino per lihasryhmä
        for (const set of exercise.sets) {
          if (!recordMap[group] || set.weight > recordMap[group].weight) {
            recordMap[group] = { exercise: name, weight: set.weight };
          }
        }
      }
    }

    const muscleDistribution = Object.entries(muscleMap).map(
      ([muscleGroup, count]) => ({ muscleGroup, count }),
    );

    const personalRecords = Object.entries(recordMap).map(
      ([muscleGroup, data]) => ({
        muscleGroup,
        exercise: data.exercise,
        weight: data.weight,
      }),
    );

    res.json({
      totalXp: user.xp,
      level: user.level,
      xpToNextLevel: user.xpToNextLevel,
      totalSessions: user.trainingSessions.length,
      muscleDistribution,
      personalRecords,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users — luo uusi käyttäjä
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    // fetch default training programs for newly created user:
    const updatedUser = await fetchDefaultProgramsForUser(user.googleId);
    res.status(201).json(updatedUser || user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Sähköposti on jo käytössä' });
    }
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/users/:id — päivitä käyttäjä
exports.updateUser = async (req, res) => {
  try {
    if (req.user.googleId !== req.params.id) {
      return res
        .status(403)
        .json({ error: 'Ei oikeuksia muokata toista käyttäjää' });
    }
    // Suojataan level ja xp suoralta muokkaukselta
    const { ...safeFields } = req.body;
    const user = await User.findOneAndUpdate(
      { googleId: req.params.id },
      safeFields,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
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
      return res
        .status(403)
        .json({ error: 'Ei oikeuksia poistaa toista käyttäjää' });
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

// GET /api/users/:id/calendar
exports.getCalendarDates = async (req, res) => {
  try {
    if (req.user.googleId !== req.params.id) {
      return res.status(403).json({ error: 'Ei oikeuksia' });
    }
    // Haetaan vain datetime-kenttä, ei koko trainingSessions-arrayta
    const user = await User.findOne(
      { googleId: req.params.id },
      { 'trainingSessions.datetime': 1 },
    );
    if (!user) {
      return res.status(404).json({ error: 'Käyttäjää ei löytynyt' });
    }
    // Palautetaan pelkät päivämäärät YYYY-MM-DD muodossa
    const dates = user.trainingSessions.map(
      (s) => s.datetime.toISOString().split('T')[0],
    );
    res.json(dates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
