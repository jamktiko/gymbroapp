const mongoose = require('mongoose');
const { EmbeddedMoveSchema } = require('./Move');

// Setti: suunniteltu (ohjelmasta) + toteutunut (käyttäjän syöttämä)
const SetSchema = new mongoose.Schema(
  {
    plannedReps: {
      type: Number,
      required: [true, 'Suunniteltu toistomäärä on pakollinen'],
      min: 1,
    },
    plannedWeight: {
      type: Number,
      required: [true, 'Suunniteltu paino on pakollinen'],
      min: 0,
    },
    completedReps: {
      type: Number,
      default: null,
      min: 0,
    },
    completedWeight: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  { _id: false },
);

// Yksittäinen liike sessiossa: liike + setit
const ExerciseSchema = new mongoose.Schema(
  {
    move: {
      type: EmbeddedMoveSchema,
      required: [true, 'Liike on pakollinen'],
    },
    sets: {
      type: [SetSchema],
      validate: {
        validator: (sets) => sets.length > 0,
        message: 'Liikkeellä täytyy olla vähintään yksi setti',
      },
    },
  },
  { _id: false },
);

// Schema for TrainingSession data
const TrainingSessionSchema = new mongoose.Schema(
  {
    datetime: {
      type: Date,
      default: Date.now,
    },
    exercises: {
      type: [ExerciseSchema],
      validate: {
        validator: (exercises) => exercises.length > 0,
        message: 'Sessiossa täytyy olla vähintään yksi liike',
      },
    },
    breakTimeSeconds: {
      type: Number,
      default: 120,
      min: 1,
    },
  },
  { timestamps: true },
);

module.exports = TrainingSessionSchema;