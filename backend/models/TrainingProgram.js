const mongoose = require('mongoose');
const { MoveSchema } = require('./Move');

// Schema for TrainingProgram data
const TrainingProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ohjelman nimi on pakollinen'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // moves as embedded documents:
  moves: {
    type: [MoveSchema],
  },
  // true = adminin luoma -> käyttäjä ei voi poistaa
  isDefault: {
    type: Boolean,
    default: false,
  },
});

// export TrainingProgramSchema (only used inside User, so no need to make it into a Model here)
module.exports = TrainingProgramSchema;
