const mongoose = require('mongoose');
const { EmbeddedMoveSchema } = require('./Move');

// Schema for TrainingProgram data
const TrainingProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ohjelman nimi on pakollinen'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // moves duplicated fully inside the program:
  moves: {
    type: [EmbeddedMoveSchema],
  },
  // true = adminin luoma -> käyttäjä ei voi poistaa
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const Trainingprogram = mongoose.model(
  'Trainingprogram',
  TrainingProgramSchema,
);

// export TrainingProgramSchema (only used inside User, so no need to make it into a Model here)
// export Trainingprogram model
module.exports = { TrainingProgramSchema, Trainingprogram };
