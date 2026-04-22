const mongoose = require('mongoose');

// Yksittäinen setti: toistot + paino
const setSchema = new mongoose.Schema(
  {
    reps: {
      type: Number,
      required: [true, 'Toistot on pakollinen'],
      min: 0,
    },
    weight: {
      type: Number,
      required: [true, 'Paino on pakollinen'],
      min: 0,
    },
  },
  { _id: false }
);

// Yksittäinen liike sessiossa: liike + setit
const exerciseSchema = new mongoose.Schema(
  {
    move: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Move',
      required: [true, 'Liike on pakollinen'],
    },
    sets: {
      type: [setSchema],
      validate: {
        validator: (sets) => sets.length > 0,
        message: 'Liikkeellä täytyy olla vähintään yksi setti',
      },
    },
  },
  { _id: false }
);

const trainingSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Käyttäjä on pakollinen'],
    },
    datetime: {
      type: Date,
      default: Date.now,
    },
    exercises: {
      type: [exerciseSchema],
      validate: {
        validator: (exercises) => exercises.length > 0,
        message: 'Sessiossa täytyy olla vähintään yksi liike',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);
