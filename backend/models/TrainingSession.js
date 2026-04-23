const mongoose = require('mongoose');
const { EmbeddedMoveSchema } = require('./Move');

// Yksittäinen setti: toistot + paino
const SetSchema = new mongoose.Schema(
  {
    reps: {
      type: Number,
      required: [true, 'Toistot on pakollinen'],
      min: 1,
    },
    weight: {
      type: Number,
      required: [true, 'Paino on pakollinen'],
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
    // break time in seconds, defaults to 2 minutes
    breakTimeSeconds: {
      type: Number,
      default: 120,
      min: 1,
    },
  },
  { timestamps: true },
);

// export TrainingSessionSchema (only used inside User, so no need to make it into a Model here)
module.exports = TrainingSessionSchema;
