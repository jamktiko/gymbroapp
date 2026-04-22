const mongoose = require('mongoose');

// Schema for Move data
const MoveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Liikkeen nimi on pakollinen'],
    trim: true,
    unique: true,
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
});

const Move = mongoose.model('Move', MoveSchema);

// export MoveSchema AND Move-model
module.exports = { MoveSchema, Move };
