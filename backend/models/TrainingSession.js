const mongoose = require('mongoose');
// const { EmbeddedMoveSchema } = require('./Move');
const ExerciseSchema = require('./Exercise');

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