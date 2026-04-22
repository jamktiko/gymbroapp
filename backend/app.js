const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const authMiddleware = require('./middleware/auth');

const movesRouter = require('./routes/moves');
const usersRouter = require('./routes/users');
const trainingProgramsRouter = require('./routes/trainingPrograms');
const trainingSessionsRouter = require('./routes/trainingSessions');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Auth placeholder — täytyy tulla ennen reittejä
app.use(authMiddleware);

// API-reitit
app.use('/api/moves', movesRouter);
app.use('/api/users', usersRouter);
app.use('/api/training-programs', trainingProgramsRouter);
app.use('/api/training-sessions', trainingSessionsRouter);

// Terveystarkistus
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Reitti ei löydy' });
});

// Virheenkäsittely
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Palvelinvirhe' });
});

module.exports = app;