const mongoose = require('mongoose');
const TrainingSessionSchema = require('./TrainingSession');
const { TrainingProgramSchema } = require('./TrainingProgram');

// Schema for User data
// name and email come from google auth token
// login is done through google auth
const UserSchema = new mongoose.Schema(
  {
      googleId: {
      type: String,
      required: [true, 'Google ID is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Nimi on pakollinen'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Sähköposti on pakollinen'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    exp: {
      type: Number,
      default: 0,
      min: 0,
    },
    // weight unit to be used in trainingSessions: kg or lbs
    weightUnit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
    // trainingPrograms as embedded document:
    trainingPrograms: {
      type: [TrainingProgramSchema],
      default: [],
    },
    // trainingSessions as embedded document:
    trainingSessions: {
      type: [TrainingSessionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

// create a model out of UserSchema
const User = mongoose.model('User', UserSchema);

// export User-model
module.exports = User;
