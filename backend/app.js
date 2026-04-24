const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const verifyToken = require('./middleware/verifyToken');

// import routes to variables
const movesRouter = require('./routes/moves');
const usersRouter = require('./routes/users');
const trainingProgramsRouter = require('./routes/trainingPrograms');
const trainingSessionsRouter = require('./routes/trainingSessions');

// create express app
const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('Yhteys MongoDB:hen onnistui'))
  .catch((err) => console.error('MongoDB virhe:', err));

app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Auth placeholder — täytyy tulla ennen reittejä
app.use('/api/auth', authRouter);

// API-reitit
app.use('/api/moves', movesRouter);
app.use('/api/users', usersRouter);
app.use('/api/training-programs', trainingProgramsRouter);
app.use('/api/training-sessions', trainingSessionsRouter);

// connection health check
app.get('/', (req, res) => res.json({ status: 'ok' }));

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
