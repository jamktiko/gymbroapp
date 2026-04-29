const mongoose = require('mongoose');
// const { EmbeddedMoveSchema } = require('./Move');
const ExerciseSchema = require('./Exercise');

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
  // exercises inside the program (duplicates whole embedded move JSON objects here):
  exercises: {
    type: [ExerciseSchema],
    validate: {
      validator: (exercises) => exercises.length > 0,
      message: 'Treenissä täytyy olla vähintään yksi liike',
    },
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

// export Trainingprogram model
module.exports = { TrainingProgramSchema, Trainingprogram };
