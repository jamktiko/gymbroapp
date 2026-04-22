const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ohjelman nimi on pakollinen'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    moves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Move',
      },
    ],
    // true = admin/seed luoma, käyttäjä ei voi poistaa
    isDefault: {
      type: Boolean,
      default: false,
    },
    // null = seed/admin luoma default-ohjelma
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);
