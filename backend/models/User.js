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
    xp: {
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

UserSchema.virtual('level').get(function () {
  return Math.floor(Math.sqrt(this.xp / 50)) + 1;
});

UserSchema.virtual('xpToNextLevel').get(function () {
  const next = this.level ** 2 * 50;
  return next - this.xp;
});

//Virtuaalikekentät level ja xpToNextLevel lasketaan xp:n perusteella, eikä niitä 
// tallenneta tietokantaan. Ne näkyvät kuitenkin JSON-muodossa, kun User-objekti muunnetaan JSONiksi.
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
// create a model out of UserSchema
const User = mongoose.model('User', UserSchema);

// export User-model
module.exports = User;
