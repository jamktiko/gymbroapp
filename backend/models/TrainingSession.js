const mongoose = require('mongoose');
const MoveSchema = require('./Move');

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
  },
  { timestamps: true },
);

// Yksittäinen liike sessiossa: liike + setit
const ExerciseSchema = new mongoose.Schema(
  {
    move: {
      type: MoveSchema,
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

// export TrainingSessionSchema (only used inside User, so no need to make it into a Model here)
module.exports = TrainingSessionSchema;
