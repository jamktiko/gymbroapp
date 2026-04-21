const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  move: {
    type: String,
    required: [true, 'Liikkeen nimi on pakollinen'],
    trim: true,
    unique: true,           // sama liike ei voi olla kahteen kertaan
  },

  type: {
    type: String,
    enum: {
      values: ['compound', 'targeted'],
      message: 'Type voi olla vain "compound" tai "targeted"'
    },
    required: [true, 'Valitse onko liike compound vai targeted'],
  },

  // Voit myöhemmin lisätä näitä helposti:
  // muscleGroup: String,
  // equipment: String,
  // difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] }
});

module.exports = mongoose.model('Move', moveSchema);
