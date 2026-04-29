const mongoose = require('mongoose');
const { EmbeddedMoveSchema } = require('./Move');

// Ohjelman setti-template: tavoitetoistot ja paino
const ProgramSetSchema = new mongoose.Schema(
  {
    reps: {
      type: Number,
      required: [true, 'Toistomäärä on pakollinen'],
      min: 1,
      default: 10,
    },
    weight: {
      type: Number,
      required: [true, 'Paino on pakollinen'],
      min: 0,
      default: 0,
    },
  },
  { _id: false },
);

// Liike ohjelmassa: liike + tavoitesetit
const ProgramMoveSchema = new mongoose.Schema(
  {
    move: {
      type: EmbeddedMoveSchema,
      required: [true, 'Liike on pakollinen'],
    },
    sets: {
      type: [ProgramSetSchema],
      default: [
        { reps: 10, weight: 0 },
        { reps: 10, weight: 0 },
        { reps: 10, weight: 0 },
      ],
      validate: {
        validator: (sets) => sets.length > 0,
        message: 'Liikkeellä täytyy olla vähintään yksi setti',
      },
    },
  },
  { _id: false },
);

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
  moves: {
    type: [ProgramMoveSchema],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const Trainingprogram = mongoose.model('Trainingprogram', TrainingProgramSchema);

module.exports = { TrainingProgramSchema, Trainingprogram };