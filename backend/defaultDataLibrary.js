require('dotenv').config();
const mongoose = require('mongoose');
const Move = require('./models/Move');
const TrainingProgram = require('./models/TrainingProgram');

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

const defaultMovesDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB yhdistetty');

    await Move.deleteMany({ isDefault: true });
    await TrainingProgram.deleteMany({ isDefault: true });
    console.log('Vanhat default-tiedot poistettu');

    const moves = await Move.insertMany(defaultMoves);
    console.log(`${moves.length} liikettä lisätty`);

    const getMoveId = (name) => moves.find((m) => m.name === name)?._id;

    const defaultPrograms = [
      {
        name: 'PPL — Push Pull Legs',
        description:
          'Klassinen 6-päiväinen ohjelma: push, pull ja jalat vuorotellen.',
        isDefault: true,
        moves: [
          getMoveId('Penkkipunnerrus'),
          getMoveId('Pystypunnerrus'),
          getMoveId('Dippi'),
          getMoveId('Käsiprässi'),
          getMoveId('Kolmikääntö'),
          getMoveId('Ylätalja'),
          getMoveId('Soutu tangolla'),
          getMoveId('Leuanveto'),
          getMoveId('Hauiskääntö'),
          getMoveId('Kyykky'),
          getMoveId('Maastanosto'),
          getMoveId('Jalkaprässi'),
          getMoveId('Leg curl'),
          getMoveId('Pohjepunnerrus'),
        ].filter(Boolean),
      },
      {
        name: 'Full Body — Aloittelijaohjelma',
        description:
          '3 kertaa viikossa koko keho. Hyvä lähtökohta aloittelijalle.',
        isDefault: true,
        moves: [
          getMoveId('Kyykky'),
          getMoveId('Penkkipunnerrus'),
          getMoveId('Soutu tangolla'),
          getMoveId('Pystypunnerrus'),
          getMoveId('Maastanosto'),
          getMoveId('Hauiskääntö'),
          getMoveId('Kolmikääntö'),
        ].filter(Boolean),
      },
      {
        name: 'Upper / Lower',
        description: '4-päiväinen ylä- ja alavartalon vuorotteleva ohjelma.',
        isDefault: true,
        moves: [
          getMoveId('Penkkipunnerrus'),
          getMoveId('Ylätalja'),
          getMoveId('Pystypunnerrus'),
          getMoveId('Soutu tangolla'),
          getMoveId('Hauiskääntö'),
          getMoveId('Kolmikääntö'),
          getMoveId('Kyykky'),
          getMoveId('Maastanosto'),
          getMoveId('Jalkaprässi'),
          getMoveId('Leg curl'),
          getMoveId('Pohjepunnerrus'),
        ].filter(Boolean),
      },
    ];

    const programs = await TrainingProgram.insertMany(defaultPrograms);
    console.log(`${programs.length} ohjelmaa lisätty`);

    console.log('Default movien lisääminen valmis!');
    process.exit(0);
  } catch (err) {
    console.error('Default movien lisääminen epäonnistui:', err.message);
    process.exit(1);
  }
};

defaultMovesDB();
