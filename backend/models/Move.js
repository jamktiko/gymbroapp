const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema(
  {
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
    muscle_group: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    // null = admin/seed luoma default-liike
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Move', moveSchema);