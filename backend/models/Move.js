const mongoose = require('mongoose');

// Base fields mapped without strict indexes spreading.
const moveFields = {
  name: {
    type: String,
    required: [true, 'Liikkeen nimi on pakollinen'],
    trim: true,
  },
  type: {
    type: String,
    enum: {
      values: ['compound', 'targeted'],
      message: 'Type voi olla vain "compound" tai "targeted"',
    },
    required: [true, 'Valitse onko liike compound vai targeted'],
  },
  muscleGroup: {
    type: String,
    trim: true,
  },
  image_url: {
    type: String,
    trim: true,
  },
  // true = adminin luoma -> käyttäjä ei voi poistaa
  isDefault: {
    type: Boolean,
    default: false,
  },
  // null = adminin luoma default-liike
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
};

// Main collection schema (Move)
const MoveSchema = new mongoose.Schema(moveFields);
// Unique-indeksi erikseen, jotta upotettava kopio ei peri sitä ja aiheuta ongelmia useamman ohjelman kanssa.
MoveSchema.index({ name: 1 }, { unique: true });

// Erillinen schema upotukseen – ei indeksejä eikä omaa kokoelmaa,
// joten sama liike voi esiintyä useassa ohjelmassa ongelmitta.
const EmbeddedMoveSchema = new mongoose.Schema({
  ...moveFields,
  sets: {
    type: [
      {
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
      },
    ],
    default: [
      { reps: 10, weight: 0 },
      { reps: 10, weight: 0 },
      { reps: 10, weight: 0 },
    ],
  },
});

const Move = mongoose.model('Move', MoveSchema);

// export models and schemas
module.exports = { EmbeddedMoveSchema, Move };
