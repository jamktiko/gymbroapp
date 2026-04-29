require('dotenv').config();
const mongoose = require('mongoose');
const { Move } = require('./models/Move');
const { Trainingprogram } = require('./models/TrainingProgram');

const defaultMoves = [
  // Compound
  {
    name: 'Penkkipunnerrus',
    type: 'compound',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  { name: 'Kyykky', type: 'compound', muscleGroup: 'Jalat', isDefault: true },
  {
    name: 'Maastanosto',
    type: 'compound',
    muscleGroup: 'Selkä',
    isDefault: true,
  },
  { name: 'Ylätalja', type: 'compound', muscleGroup: 'Selkä', isDefault: true },
  {
    name: 'Pystypunnerrus',
    type: 'compound',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Soutu tangolla',
    type: 'compound',
    muscleGroup: 'Selkä',
    isDefault: true,
  },
  {
    name: 'Leuanveto',
    type: 'compound',
    muscleGroup: 'Selkä',
    isDefault: true,
  },
  { name: 'Dippi', type: 'compound', muscleGroup: 'Rinta', isDefault: true },
  // Targeted
  {
    name: 'Hauiskääntö',
    type: 'targeted',
    muscleGroup: 'Hauis',
    isDefault: true,
  },
  {
    name: 'Kolmikääntö',
    type: 'targeted',
    muscleGroup: 'Kolmikärjes',
    isDefault: true,
  },
  {
    name: 'Jalkaprässi',
    type: 'targeted',
    muscleGroup: 'Jalat',
    isDefault: true,
  },
  {
    name: 'Käsiprässi',
    type: 'targeted',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  {
    name: 'Sivunousu',
    type: 'targeted',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Pohjepunnerrus',
    type: 'targeted',
    muscleGroup: 'Pohkeet',
    isDefault: true,
  },
  {
    name: 'Vatsakrullaaja',
    type: 'targeted',
    muscleGroup: 'Vatsa',
    isDefault: true,
  },
  {
    name: 'Leg curl',
    type: 'targeted',
    muscleGroup: 'Takareidet',
    isDefault: true,
  },
];

const defaultTrainingprograms = [
  {
    name: 'PPL — Push Pull Legs',
    description:
      'Klassinen 6-päiväinen ohjelma: push, pull ja jalat vuorotellen.',
    isDefault: true,
    exercises: [
      {
        move: {
          name: 'Penkkipunnerrus',
          type: 'compound',
          muscleGroup: 'Rinta',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Pystypunnerrus',
          type: 'compound',
          muscleGroup: 'Hartiat',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Dippi',
          type: 'compound',
          muscleGroup: 'Rinta',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Käsiprässi',
          type: 'targeted',
          muscleGroup: 'Rinta',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Kolmikääntö',
          type: 'targeted',
          muscleGroup: 'Kolmikärjes',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Ylätalja',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Soutu tangolla',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Leuanveto',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Hauiskääntö',
          type: 'targeted',
          muscleGroup: 'Hauis',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Kyykky',
          type: 'compound',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Maastanosto',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Jalkaprässi',
          type: 'targeted',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Leg curl',
          type: 'targeted',
          muscleGroup: 'Takareidet',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Pohjepunnerrus',
          type: 'targeted',
          muscleGroup: 'Pohkeet',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
    ],
  },
  {
    name: 'Full Body — Aloittelijaohjelma',
    description: '3 kertaa viikossa koko keho. Hyvä lähtökohta aloittelijalle.',
    isDefault: true,
    exercises: [
      {
        move: {
          name: 'Kyykky',
          type: 'compound',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Penkkipunnerrus',
          type: 'compound',
          muscleGroup: 'Rinta',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Soutu tangolla',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Pystypunnerrus',
          type: 'compound',
          muscleGroup: 'Hartiat',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Maastanosto',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Hauiskääntö',
          type: 'targeted',
          muscleGroup: 'Hauis',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Kolmikääntö',
          type: 'targeted',
          muscleGroup: 'Kolmikärjes',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
    ],
  },
  {
    name: 'Upper / Lower',
    description: '4-päiväinen ylä- ja alavartalon vuorotteleva ohjelma.',
    isDefault: true,
    exercises: [
      {
        move: {
          name: 'Penkkipunnerrus',
          type: 'compound',
          muscleGroup: 'Rinta',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Ylätalja',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Pystypunnerrus',
          type: 'compound',
          muscleGroup: 'Hartiat',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Soutu tangolla',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Hauiskääntö',
          type: 'targeted',
          muscleGroup: 'Hauis',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Kolmikääntö',
          type: 'targeted',
          muscleGroup: 'Kolmikärjes',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Kyykky',
          type: 'compound',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Maastanosto',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Jalkaprässi',
          type: 'targeted',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Leg curl',
          type: 'targeted',
          muscleGroup: 'Takareidet',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
      {
        move: {
          name: 'Pohjepunnerrus',
          type: 'targeted',
          muscleGroup: 'Pohkeet',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
      },
    ],
  },
];

const addDefaultData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URL);
    console.log('MongoDB yhdistetty');

    await Move.deleteMany({ isDefault: true });
    await Trainingprogram.deleteMany({ isDefault: true });
    console.log('Vanhat default-datat poistettu');

    const moves = await Move.insertMany(defaultMoves);
    console.log(`${moves.length} default-liikettä lisätty`);

    const Trainingprograms = await Trainingprogram.insertMany(
      defaultTrainingprograms,
    );
    console.log(`${Trainingprograms.length} default-treeniohjelmaa lisätty`);

    // Päivitä olemassa olevien käyttäjien treeniohjelmien 'moves'-kenttä 'exercises'-kentäksi uuteen skeemaan
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    let usersUpdated = 0;
    for (const user of users) {
      if (user.trainingPrograms && user.trainingPrograms.length > 0) {
        let updated = false;
        const newPrograms = user.trainingPrograms.map(tp => {
          if (tp.moves) {
            // Transform old flat moves into new ExerciseSchema structure
            tp.exercises = tp.moves.map(m => ({
              move: m,
              sets: [
                { reps: 10, weight: 0 },
                { reps: 10, weight: 0 },
                { reps: 10, weight: 0 }
              ]
            }));
            delete tp.moves;
            updated = true;
          }
          return tp;
        });
        if (updated) {
          await mongoose.connection.db.collection('users').updateOne(
            { _id: user._id },
            { $set: { trainingPrograms: newPrograms } }
          );
          usersUpdated++;
        }
      }
    }
    console.log(`${usersUpdated} käyttäjän treeniohjelmat päivitetty uuteen Exercise-skeemaan`);


    console.log('Datan lisääminen onnistui!');
    process.exit(0);
  } catch (err) {
    console.error('Datan lisääminen epäonnistui:', err.message);
    process.exit(1);
  }
};

addDefaultData();
