const { EmbeddedMoveSchema } = require('./Move');
const mongoose = require('mongoose');

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

module.exports = ExerciseSchema;
