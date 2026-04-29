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
