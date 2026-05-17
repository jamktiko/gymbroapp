require('dotenv').config();
const mongoose = require('mongoose');
const { Move } = require('./models/Move');
const { Trainingprogram } = require('./models/TrainingProgram');

const defaultMoves = [
  // ========================= RINTA (Chest) =========================
  {
    name: 'Penkkipunnerrus',
    type: 'compound',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  {
    name: 'Vinopenkkipunnerrus',
    type: 'compound',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  {
    name: 'Laskeva penkkipunnerrus',
    type: 'compound',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  {
    name: 'Käsipainopunnerrus',
    type: 'compound',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  {
    name: 'Vinopenkki käsipainopunnerrus',
    type: 'compound',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  { name: 'Dippi', type: 'compound', muscleGroup: 'Rinta', isDefault: true },
  {
    name: 'Käsiprässi',
    type: 'targeted',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  {
    name: 'Ristikkäistaljavedot',
    type: 'targeted',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  {
    name: 'Peck deck',
    type: 'targeted',
    muscleGroup: 'Rinta',
    isDefault: true,
  },
  {
    name: 'Käsipainolevitys',
    type: 'targeted',
    muscleGroup: 'Rinta',
    isDefault: true,
  },

  // ========================= SELKÄ (Back) =========================
  {
    name: 'Maastanosto',
    type: 'compound',
    muscleGroup: 'Selkä',
    isDefault: true,
  },
  { name: 'Ylätalja', type: 'compound', muscleGroup: 'Selkä', isDefault: true },
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
  { name: 'Alatalja', type: 'compound', muscleGroup: 'Selkä', isDefault: true },
  {
    name: 'Käsipainosoutu',
    type: 'targeted',
    muscleGroup: 'Selkä',
    isDefault: true,
  },
  {
    name: 'T-tankosoutu',
    type: 'compound',
    muscleGroup: 'Selkä',
    isDefault: true,
  },
  {
    name: 'Suorin käsin ylätalja',
    type: 'targeted',
    muscleGroup: 'Selkä',
    isDefault: true,
  },
  {
    name: 'Hyperextensio',
    type: 'targeted',
    muscleGroup: 'Selkä',
    isDefault: true,
  },

  // ========================= HARTIAT (Shoulders) =========================
  {
    name: 'Pystypunnerrus',
    type: 'compound',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Käsipainopystypunnerrus',
    type: 'compound',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Arnold-punnerrus',
    type: 'compound',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Pystysoutu',
    type: 'compound',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Sivunousu',
    type: 'targeted',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Etunousu',
    type: 'targeted',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Face pull',
    type: 'targeted',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },
  {
    name: 'Takaolkapääkone',
    type: 'targeted',
    muscleGroup: 'Hartiat',
    isDefault: true,
  },

  // ========================= HAUIS (Biceps) =========================
  {
    name: 'Hauiskääntö tangolla',
    type: 'targeted',
    muscleGroup: 'Hauis',
    isDefault: true,
  },
  {
    name: 'Hauiskääntö käsipainoilla',
    type: 'targeted',
    muscleGroup: 'Hauis',
    isDefault: true,
  },
  {
    name: 'Vasarakääntö',
    type: 'targeted',
    muscleGroup: 'Hauis',
    isDefault: true,
  },
  {
    name: 'Keskittynyt hauiskääntö',
    type: 'targeted',
    muscleGroup: 'Hauis',
    isDefault: true,
  },
  {
    name: 'Scott-kääntö',
    type: 'targeted',
    muscleGroup: 'Hauis',
    isDefault: true,
  },
  {
    name: 'Taljahauiskääntö',
    type: 'targeted',
    muscleGroup: 'Hauis',
    isDefault: true,
  },

  // ========================= OJENTAJA (Triceps) =========================
  // HUOM: vanha muscleGroup 'Kolmikärjes' korjattu → 'Ojentaja'
  {
    name: 'Ojentajapunnerrus taljassa',
    type: 'targeted',
    muscleGroup: 'Ojentaja',
    isDefault: true,
  },
  {
    name: 'Ranskalainen punnerrus',
    type: 'targeted',
    muscleGroup: 'Ojentaja',
    isDefault: true,
  },
  {
    name: 'Ojentajapotkut',
    type: 'targeted',
    muscleGroup: 'Ojentaja',
    isDefault: true,
  },
  {
    name: 'Kapea penkkipunnerrus',
    type: 'compound',
    muscleGroup: 'Ojentaja',
    isDefault: true,
  },
  {
    name: 'Ylätaljaojennukset',
    type: 'targeted',
    muscleGroup: 'Ojentaja',
    isDefault: true,
  },

  // ========================= JALAT / ETUREIDET (Quads) =========================
  { name: 'Kyykky', type: 'compound', muscleGroup: 'Jalat', isDefault: true },
  {
    name: 'Etukyykky',
    type: 'compound',
    muscleGroup: 'Jalat',
    isDefault: true,
  },
  {
    name: 'Hack-kyykky',
    type: 'compound',
    muscleGroup: 'Jalat',
    isDefault: true,
  },
  {
    name: 'Jalkaprässi',
    type: 'compound',
    muscleGroup: 'Jalat',
    isDefault: true,
  },
  {
    name: 'Bulgarialainen kyykky',
    type: 'compound',
    muscleGroup: 'Jalat',
    isDefault: true,
  },
  {
    name: 'Askelkyykky',
    type: 'compound',
    muscleGroup: 'Jalat',
    isDefault: true,
  },
  {
    name: 'Jalkojen ojennus',
    type: 'targeted',
    muscleGroup: 'Jalat',
    isDefault: true,
  },
  {
    name: 'Sissy-kyykky',
    type: 'targeted',
    muscleGroup: 'Jalat',
    isDefault: true,
  },

  // ========================= TAKAREIDET (Hamstrings) =========================
  {
    name: 'Jalkojen koukistus',
    type: 'targeted',
    muscleGroup: 'Takareidet',
    isDefault: true,
  },
  {
    name: 'Romania maastanosto',
    type: 'compound',
    muscleGroup: 'Takareidet',
    isDefault: true,
  },
  {
    name: 'Suorin jaloin maastanosto',
    type: 'compound',
    muscleGroup: 'Takareidet',
    isDefault: true,
  },

  // ========================= PAKARAT (Glutes) =========================
  {
    name: 'Lonkan ojennus taljassa',
    type: 'targeted',
    muscleGroup: 'Pakarat',
    isDefault: true,
  },
  {
    name: 'Hip thrust',
    type: 'compound',
    muscleGroup: 'Pakarat',
    isDefault: true,
  },
  {
    name: 'Loitontajakone',
    type: 'targeted',
    muscleGroup: 'Pakarat',
    isDefault: true,
  },

  // ========================= POHKEET (Calves) =========================
  {
    name: 'Pohjenousu seisten',
    type: 'targeted',
    muscleGroup: 'Pohkeet',
    isDefault: true,
  },
  {
    name: 'Pohjenousu istuen',
    type: 'targeted',
    muscleGroup: 'Pohkeet',
    isDefault: true,
  },

  // ========================= VATSA (Core) =========================
  {
    name: 'Vatsakrullaaja',
    type: 'targeted',
    muscleGroup: 'Vatsa',
    isDefault: true,
  },
  {
    name: 'Roikkuen jalkojen nosto',
    type: 'targeted',
    muscleGroup: 'Vatsa',
    isDefault: true,
  },
  {
    name: 'Vatsarutistus taljassa',
    type: 'targeted',
    muscleGroup: 'Vatsa',
    isDefault: true,
  },
  { name: 'Lankku', type: 'targeted', muscleGroup: 'Vatsa', isDefault: true },
  {
    name: 'Russian twist',
    type: 'targeted',
    muscleGroup: 'Vatsa',
    isDefault: true,
  },
  {
    name: 'Vinojen vatsalihasten rutistus',
    type: 'targeted',
    muscleGroup: 'Vatsa',
    isDefault: true,
  },
];

// Treeniohjelmissa käytetään nyt oikeita liikenimiä yllä olevasta listasta
const defaultTrainingprograms = [
  {
    name: 'PPL — Push Pull Legs',
    description:
      'Klassinen 6-päiväinen ohjelma: push, pull ja jalat vuorotellen.',
    isDefault: true,
    exercises: [
      // PUSH
      {
        move: {
          name: 'Penkkipunnerrus',
          type: 'compound',
          muscleGroup: 'Rinta',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
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
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
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
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
        ],
      },
      {
        move: {
          name: 'Sivunousu',
          type: 'targeted',
          muscleGroup: 'Hartiat',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 8 },
          { reps: 12, weight: 8 },
          { reps: 12, weight: 8 },
        ],
      },
      {
        move: {
          name: 'Ojentajapunnerrus taljassa',
          type: 'targeted',
          muscleGroup: 'Ojentaja',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
        ],
      },
      // PULL
      {
        move: {
          name: 'Ylätalja',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 40 },
          { reps: 10, weight: 40 },
          { reps: 10, weight: 40 },
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
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
        ],
      },
      {
        move: {
          name: 'Face pull',
          type: 'targeted',
          muscleGroup: 'Hartiat',
          isDefault: true,
        },
        sets: [
          { reps: 15, weight: 10 },
          { reps: 15, weight: 10 },
          { reps: 15, weight: 10 },
        ],
      },
      {
        move: {
          name: 'Hauiskääntö tangolla',
          type: 'targeted',
          muscleGroup: 'Hauis',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 15 },
          { reps: 10, weight: 15 },
          { reps: 10, weight: 15 },
        ],
      },
      // LEGS
      {
        move: {
          name: 'Kyykky',
          type: 'compound',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 8, weight: 40 },
          { reps: 8, weight: 40 },
          { reps: 8, weight: 40 },
        ],
      },
      {
        move: {
          name: 'Romania maastanosto',
          type: 'compound',
          muscleGroup: 'Takareidet',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
        ],
      },
      {
        move: {
          name: 'Jalkaprässi',
          type: 'compound',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 60 },
          { reps: 12, weight: 60 },
          { reps: 12, weight: 60 },
        ],
      },
      {
        move: {
          name: 'Jalkojen koukistus',
          type: 'targeted',
          muscleGroup: 'Takareidet',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 20 },
          { reps: 12, weight: 20 },
          { reps: 12, weight: 20 },
        ],
      },
      {
        move: {
          name: 'Pohjenousu seisten',
          type: 'targeted',
          muscleGroup: 'Pohkeet',
          isDefault: true,
        },
        sets: [
          { reps: 15, weight: 30 },
          { reps: 15, weight: 30 },
          { reps: 15, weight: 30 },
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
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
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
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
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
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
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
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
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
          { reps: 8, weight: 30 },
          { reps: 8, weight: 30 },
          { reps: 8, weight: 30 },
        ],
      },
      {
        move: {
          name: 'Hauiskääntö käsipainoilla',
          type: 'targeted',
          muscleGroup: 'Hauis',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 8 },
          { reps: 12, weight: 8 },
          { reps: 12, weight: 8 },
        ],
      },
      {
        move: {
          name: 'Ojentajapunnerrus taljassa',
          type: 'targeted',
          muscleGroup: 'Ojentaja',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
        ],
      },
    ],
  },
  {
    name: 'Upper / Lower',
    description: '4-päiväinen ylä- ja alavartalon vuorotteleva ohjelma.',
    isDefault: true,
    exercises: [
      // UPPER
      {
        move: {
          name: 'Penkkipunnerrus',
          type: 'compound',
          muscleGroup: 'Rinta',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
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
          { reps: 10, weight: 40 },
          { reps: 10, weight: 40 },
          { reps: 10, weight: 40 },
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
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
          { reps: 10, weight: 20 },
        ],
      },
      {
        move: {
          name: 'Alatalja',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
        ],
      },
      {
        move: {
          name: 'Hauiskääntö tangolla',
          type: 'targeted',
          muscleGroup: 'Hauis',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
        ],
      },
      {
        move: {
          name: 'Ranskalainen punnerrus',
          type: 'targeted',
          muscleGroup: 'Ojentaja',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 12 },
          { reps: 12, weight: 12 },
          { reps: 12, weight: 12 },
        ],
      },
      // LOWER
      {
        move: {
          name: 'Kyykky',
          type: 'compound',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 8, weight: 40 },
          { reps: 8, weight: 40 },
          { reps: 8, weight: 40 },
        ],
      },
      {
        move: {
          name: 'Romania maastanosto',
          type: 'compound',
          muscleGroup: 'Takareidet',
          isDefault: true,
        },
        sets: [
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
        ],
      },
      {
        move: {
          name: 'Jalkaprässi',
          type: 'compound',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 60 },
          { reps: 12, weight: 60 },
          { reps: 12, weight: 60 },
        ],
      },
      {
        move: {
          name: 'Jalkojen koukistus',
          type: 'targeted',
          muscleGroup: 'Takareidet',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 20 },
          { reps: 12, weight: 20 },
          { reps: 12, weight: 20 },
        ],
      },
      {
        move: {
          name: 'Pohjenousu seisten',
          type: 'targeted',
          muscleGroup: 'Pohkeet',
          isDefault: true,
        },
        sets: [
          { reps: 15, weight: 30 },
          { reps: 15, weight: 30 },
          { reps: 15, weight: 30 },
        ],
      },
    ],
  },
  {
    name: '5x5 Vahvuusohjelma',
    description:
      'Yksinkertainen 3 päivän ohjelma joka keskittyy perusliikkeisiin. Sopii aloittelijalle joka haluaa vahvistua nopeasti.',
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
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
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
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
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
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
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
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
          { reps: 5, weight: 20 },
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
          { reps: 5, weight: 30 },
          { reps: 5, weight: 30 },
          { reps: 5, weight: 30 },
          { reps: 5, weight: 30 },
          { reps: 5, weight: 30 },
        ],
      },
    ],
  },
  {
    name: 'Koneohjelma — Turvallinen alku',
    description:
      'Konepainotteinen ohjelma joka sopii ensimmäistä kertaa salille menevalle. Koneet ohjaavat liikeradan oikein.',
    isDefault: true,
    exercises: [
      {
        move: {
          name: 'Jalkaprässi',
          type: 'compound',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 40 },
          { reps: 12, weight: 40 },
          { reps: 12, weight: 40 },
        ],
      },
      {
        move: {
          name: 'Jalkojen ojennus',
          type: 'targeted',
          muscleGroup: 'Jalat',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
        ],
      },
      {
        move: {
          name: 'Jalkojen koukistus',
          type: 'targeted',
          muscleGroup: 'Takareidet',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
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
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
          { reps: 12, weight: 15 },
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
          { reps: 12, weight: 25 },
          { reps: 12, weight: 25 },
          { reps: 12, weight: 25 },
        ],
      },
      {
        move: {
          name: 'Peck deck',
          type: 'targeted',
          muscleGroup: 'Rinta',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 10 },
          { reps: 12, weight: 10 },
          { reps: 12, weight: 10 },
        ],
      },
      {
        move: {
          name: 'Alatalja',
          type: 'compound',
          muscleGroup: 'Selkä',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 20 },
          { reps: 12, weight: 20 },
          { reps: 12, weight: 20 },
        ],
      },
      {
        move: {
          name: 'Ojentajapunnerrus taljassa',
          type: 'targeted',
          muscleGroup: 'Ojentaja',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 10 },
          { reps: 12, weight: 10 },
          { reps: 12, weight: 10 },
        ],
      },
      {
        move: {
          name: 'Taljahauiskääntö',
          type: 'targeted',
          muscleGroup: 'Hauis',
          isDefault: true,
        },
        sets: [
          { reps: 12, weight: 10 },
          { reps: 12, weight: 10 },
          { reps: 12, weight: 10 },
        ],
      },
      {
        move: {
          name: 'Vatsakrullaaja',
          type: 'targeted',
          muscleGroup: 'Vatsa',
          isDefault: true,
        },
        sets: [
          { reps: 15, weight: 10 },
          { reps: 15, weight: 10 },
          { reps: 15, weight: 10 },
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

    const trainingprograms = await Trainingprogram.insertMany(
      defaultTrainingprograms,
    );
    console.log(`${trainingprograms.length} default-treeniohjelmaa lisätty`);

    console.log('Datan lisääminen onnistui!');
    process.exit(0);
  } catch (err) {
    console.error('Datan lisääminen epäonnistui:', err.message);
    process.exit(1);
  }
};

addDefaultData();
