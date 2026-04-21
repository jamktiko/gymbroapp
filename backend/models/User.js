const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
    // Yksikkö tallennetaan käyttäjälle — paino sessioissa on aina numero
    weightUnit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
    // Moneen-moneen: käyttäjällä monta ohjelmaa
    trainingPrograms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
