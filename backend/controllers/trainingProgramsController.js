const TrainingProgram = require('../models/TrainingProgram');
const User = require('../models/User');

// GET /api/training-programs — default-ohjelmat + käyttäjän omat
exports.getPrograms = async (req, res) => {
  try {
    const programs = await TrainingProgram.find({
      $or: [{ isDefault: true }, { createdBy: req.user?.id }],
    }).populate('moves');
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/training-programs/:id
exports.getProgramById = async (req, res) => {
  try {
    const program = await TrainingProgram.findById(req.params.id).populate('moves');
    if (!program) return res.status(404).json({ error: 'Ohjelmaa ei löydy' });
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/training-programs — luo uusi ohjelma
exports.createProgram = async (req, res) => {
  try {
    const program = await TrainingProgram.create({
      ...req.body,
      isDefault: false,
      createdBy: req.user?.id ?? null,
    });
    // Liitetään ohjelma käyttäjälle
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { trainingPrograms: program._id },
      });
    }
    res.status(201).json(program);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/training-programs/:id
exports.updateProgram = async (req, res) => {
  try {
    const program = await TrainingProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ error: 'Ohjelmaa ei löydy' });
    if (program.isDefault) {
      return res.status(403).json({ error: 'Default-ohjelmaa ei voi muokata' });
    }
    const updated = await TrainingProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('moves');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/training-programs/:id
exports.deleteProgram = async (req, res) => {
  try {
    const program = await TrainingProgram.findById(req.params.id);
    if (!program) return res.status(404).json({ error: 'Ohjelmaa ei löydy' });
    if (program.isDefault) {
      return res.status(403).json({ error: 'Default-ohjelmaa ei voi poistaa' });
    }
    await program.deleteOne();
    // Poistetaan viittaus käyttäjältä
    await User.updateMany(
      { trainingPrograms: program._id },
      { $pull: { trainingPrograms: program._id } }
    );
    res.json({ message: 'Ohjelma poistettu' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
