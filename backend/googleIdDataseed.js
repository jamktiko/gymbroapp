/**
 * Seed-skripti: 10kk kuntosali-treenidata (heinäkuu 2025 – huhtikuu 2026)
 *
 * Käyttö:
 *   1. Vaihda GOOGLE_ID omaksi
 *   2. Vaihda MONGO_URI tarvittaessa
 *   3. node seed-training-data.js
 */

const mongoose = require('mongoose');

// ── KONFIGURAATIO ──────────────────────────────────────────────
const GOOGLE_ID = '949356362637-8k499680i9rc1pi3is0d3d2jd61lli5k.apps.googleusercontent.com'; // <-- vaihda tähän
const MONGO_URI = 'mongodb://localhost:27017/your-db'; // <-- vaihda tarvittaessa
// ───────────────────────────────────────────────────────────────

// ── LIIKKEET ───────────────────────────────────────────────────
const MOVES = {
  // PUSH
  benchPress:    { name: 'Penkkipunnerrus',       type: 'compound',  muscleGroup: 'Rinta' },
  ohp:           { name: 'Pystypunnerrus',         type: 'compound',  muscleGroup: 'Olkapäät' },
  inclineDB:     { name: 'Vinopenkin käsipainopunnerrus', type: 'compound', muscleGroup: 'Rinta' },
  tricepPushdown:{ name: 'Ojentajapunnerrus',      type: 'targeted', muscleGroup: 'Ojentajat' },
  lateralRaise:  { name: 'Sivunosto',              type: 'targeted', muscleGroup: 'Olkapäät' },
  dips:          { name: 'Dippipunnerrus',          type: 'compound',  muscleGroup: 'Rinta' },

  // PULL
  deadlift:      { name: 'Maastaveto',             type: 'compound',  muscleGroup: 'Selkä' },
  barbellRow:    { name: 'Kulmasoutu',              type: 'compound',  muscleGroup: 'Selkä' },
  latPulldown:   { name: 'Ylätalja',                type: 'compound',  muscleGroup: 'Selkä' },
  bicepCurl:     { name: 'Hauiskääntö',             type: 'targeted', muscleGroup: 'Hauikset' },
  facePull:      { name: 'Face Pull',               type: 'targeted', muscleGroup: 'Olkapäät (taka)' },
  hammerCurl:    { name: 'Vasarakääntö',            type: 'targeted', muscleGroup: 'Hauikset' },

  // LEGS
  squat:         { name: 'Kyykky',                  type: 'compound',  muscleGroup: 'Jalat' },
  romanianDL:    { name: 'Romanian Deadlift',       type: 'compound',  muscleGroup: 'Takareisi' },
  legPress:      { name: 'Jalkaprässi',             type: 'compound',  muscleGroup: 'Jalat' },
  legCurl:       { name: 'Jalkakoukistus',          type: 'targeted', muscleGroup: 'Takareisi' },
  calfRaise:     { name: 'Pohjenosto',              type: 'targeted', muscleGroup: 'Pohkeet' },
  legExtension:  { name: 'Jalkojen ojennus',        type: 'targeted', muscleGroup: 'Etureidet' },
  bulgarianSplit:{ name: 'Bulgaria split squat',    type: 'compound',  muscleGroup: 'Jalat' },
};

// ── OHJELMAT (3 päivää / viikko, PPL) ─────────────────────────
const PROGRAMS = {
  push: [
    { moveKey: 'benchPress',     baseWeight: 60,  progression: 0.5, reps: [8, 8, 6],    setsCount: 3 },
    { moveKey: 'ohp',            baseWeight: 35,  progression: 0.3, reps: [10, 8, 8],   setsCount: 3 },
    { moveKey: 'inclineDB',      baseWeight: 18,  progression: 0.25,reps: [10, 10, 8],  setsCount: 3 },
    { moveKey: 'tricepPushdown', baseWeight: 25,  progression: 0.2, reps: [12, 12, 10], setsCount: 3 },
    { moveKey: 'lateralRaise',   baseWeight: 8,   progression: 0.1, reps: [15, 12, 12], setsCount: 3 },
  ],
  pull: [
    { moveKey: 'deadlift',    baseWeight: 80,  progression: 0.6, reps: [5, 5, 5],    setsCount: 3 },
    { moveKey: 'barbellRow',  baseWeight: 50,  progression: 0.4, reps: [8, 8, 8],    setsCount: 3 },
    { moveKey: 'latPulldown', baseWeight: 45,  progression: 0.3, reps: [10, 10, 8],  setsCount: 3 },
    { moveKey: 'bicepCurl',   baseWeight: 10,  progression: 0.15,reps: [12, 10, 10], setsCount: 3 },
    { moveKey: 'facePull',    baseWeight: 15,  progression: 0.15,reps: [15, 15, 12], setsCount: 3 },
  ],
  legs: [
    { moveKey: 'squat',      baseWeight: 60,  progression: 0.5, reps: [8, 6, 6],    setsCount: 3 },
    { moveKey: 'romanianDL', baseWeight: 50,  progression: 0.4, reps: [10, 8, 8],   setsCount: 3 },
    { moveKey: 'legPress',   baseWeight: 100, progression: 0.7, reps: [10, 10, 8],  setsCount: 3 },
    { moveKey: 'legCurl',    baseWeight: 30,  progression: 0.2, reps: [12, 12, 10], setsCount: 3 },
    { moveKey: 'calfRaise',  baseWeight: 40,  progression: 0.2, reps: [15, 15, 15], setsCount: 3 },
  ],
};

// Vaihtoliikkeet joskus (vaihtelua ~20% sessioista)
const SWAPS = {
  benchPress:    { moveKey: 'dips',           baseWeight: 0,   progression: 0.3 },
  bicepCurl:     { moveKey: 'hammerCurl',     baseWeight: 10,  progression: 0.15 },
  squat:         { moveKey: 'bulgarianSplit', baseWeight: 16,  progression: 0.2 },
  legCurl:       { moveKey: 'legExtension',   baseWeight: 25,  progression: 0.2 },
};

// ── APUFUNKTIOT ────────────────────────────────────────────────

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pyöristä lähimpään 2.5 kg
function roundWeight(w) {
  return Math.round(w / 2.5) * 2.5;
}

/**
 * Laske paino tietylle viikolle.
 * Progressio on lineaarinen + pientä satunnaisvaihtelua.
 * Joka ~8vko pieni deload (-10%).
 */
function calcWeight(baseWeight, progressionPerWeek, weekIndex) {
  const deloadCycle = Math.floor(weekIndex / 8);
  const weekInCycle = weekIndex % 8;

  // Deload-viikko = syklin viimeinen viikko
  const isDeload = weekInCycle === 7;

  const accumulated = baseWeight + progressionPerWeek * weekIndex;
  const noise = (Math.random() - 0.5) * 2.5; // ±1.25 kg
  let weight = accumulated + noise;

  if (isDeload) weight *= 0.9;

  return Math.max(0, roundWeight(weight));
}

function buildMove(moveKey) {
  const m = MOVES[moveKey];
  return {
    name: m.name,
    type: m.type,
    muscleGroup: m.muscleGroup,
    isDefault: true,
    createdBy: null,
  };
}

function buildExercise(template, weekIndex) {
  const weight = calcWeight(template.baseWeight, template.progression, weekIndex);

  const sets = template.reps.map((baseReps) => {
    // Joskus ±1 toisto
    const reps = Math.max(1, baseReps + rand(-1, 1));
    return { reps, weight };
  });

  return {
    move: buildMove(template.moveKey),
    sets,
  };
}

function maybeSwap(exercise, weekIndex) {
  const swap = SWAPS[exercise.moveKey];
  if (!swap || Math.random() > 0.2) return exercise;

  return {
    ...exercise,
    moveKey: swap.moveKey,
    baseWeight: swap.baseWeight,
    progression: swap.progression,
  };
}

// ── GENEROI SESSIOT ────────────────────────────────────────────

function generateSessions() {
  const sessions = [];
  const startDate = new Date('2025-07-01');
  const endDate = new Date('2026-04-28');
  const dayNames = ['push', 'pull', 'legs'];

  let current = new Date(startDate);
  let weekIndex = 0;
  let dayInWeek = 0;

  // Käy läpi viikot
  while (current <= endDate) {
    // 3–4 treeniä per viikko: ma, ke, pe (joskus la)
    const trainingDays = [1, 3, 5]; // ma, ke, pe
    if (Math.random() > 0.7) trainingDays.push(6); // joskus la

    const weekStart = new Date(current);

    for (const dayOffset of trainingDays) {
      const sessionDate = new Date(weekStart);
      sessionDate.setDate(weekStart.getDate() + dayOffset);

      if (sessionDate > endDate) break;
      if (sessionDate < startDate) continue;

      // Skip ~8% sessioista (sairastuminen, kiire yms.)
      if (Math.random() < 0.08) continue;

      const programKey = dayNames[dayInWeek % 3];
      const program = PROGRAMS[programKey];

      const exercises = program.map((template) => {
        const t = maybeSwap(template, weekIndex);
        return buildExercise(t, weekIndex);
      });

      // Treeniaika: klo 7–19, satunnainen
      const hour = rand(7, 19);
      const minute = rand(0, 59);
      sessionDate.setHours(hour, minute, 0, 0);

      sessions.push({
        datetime: new Date(sessionDate),
        exercises,
        breakTimeSeconds: [90, 120, 150, 180][rand(0, 3)],
      });

      dayInWeek++;
    }

    // Seuraava viikko
    current.setDate(current.getDate() + 7);
    weekIndex++;
  }

  // Järjestä kronologisesti
  sessions.sort((a, b) => a.datetime - b.datetime);
  return sessions;
}

// ── SEED ───────────────────────────────────────────────────────

async function seed() {
  if (GOOGLE_ID === 'VAIHDA_OMA_GOOGLE_ID') {
    console.error('⚠️  Vaihda GOOGLE_ID ennen ajamista!');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB yhdistetty');

  const sessions = generateSessions();
  console.log(`📊 Generoitu ${sessions.length} treeni-sessiota`);

  // Päivitä käyttäjän trainingSessions
  const result = await mongoose.connection.db.collection('users').updateOne(
    { googleId: GOOGLE_ID },
    { $push: { trainingSessions: { $each: sessions } } },
  );

  if (result.matchedCount === 0) {
    console.error('❌ Käyttäjää ei löytynyt googleId:llä:', GOOGLE_ID);
  } else {
    console.log(`✅ ${sessions.length} sessiota lisätty käyttäjälle`);
  }

  // Tulosta esimerkki
  console.log('\n📋 Esimerkki-sessio:');
  console.log(JSON.stringify(sessions[0], null, 2));

  console.log('\n📋 Viimeinen sessio:');
  console.log(JSON.stringify(sessions[sessions.length - 1], null, 2));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Virhe:', err);
  process.exit(1);
});