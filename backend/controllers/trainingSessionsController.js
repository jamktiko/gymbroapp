const TrainingSession = require('../models/TrainingSession');

// GET /api/training-sessions — käyttäjän kaikki sessiot (kalenterinäkymä + graafi)
exports.getSessions = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { user: req.user?.id };

    // Valinnainen aikarajaus: ?from=2024-01-01&to=2024-12-31
    if (from || to) {
      filter.datetime = {};
      if (from) filter.datetime.$gte = new Date(from);
      if (to) filter.datetime.$lte = new Date(to);
    }

    const sessions = await TrainingSession.find(filter)
      .populate('exercises.move')
      .sort({ datetime: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/training-sessions/:id
exports.getSessionById = async (req, res) => {
  try {
    const session = await TrainingSession.findById(req.params.id).populate(
      'exercises.move'
    );
    if (!session) return res.status(404).json({ error: 'Sessiota ei löydy' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/training-sessions — tallenna treenikerta
// Body: { datetime, exercises: [{ move: id, sets: [{ reps, weight }] }] }
exports.createSession = async (req, res) => {
  try {
    const session = await TrainingSession.create({
      ...req.body,
      user: req.user?.id,
    });
    await session.populate('exercises.move');
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/training-sessions/:id — muokkaa sessiota
exports.updateSession = async (req, res) => {
  try {
    const session = await TrainingSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('exercises.move');
    if (!session) return res.status(404).json({ error: 'Sessiota ei löydy' });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/training-sessions/:id
exports.deleteSession = async (req, res) => {
  try {
    const session = await TrainingSession.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ error: 'Sessiota ei löydy' });
    res.json({ message: 'Sessio poistettu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
