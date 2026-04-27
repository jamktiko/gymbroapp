const express = require('express');
const passport = require('passport');
const router = express.Router();

// // importataan controller
// const googleuserController = require('../controllers/googleusercontroller');

const {
  // getUserById,
  createUser,
  // updateUser,
  // deleteUser,
} = require('../controllers/usersController');

// etusivu
router.get('/', function (req, res) {
  res.render('index.hbs');
});

// profiilisivu suojattu isLoggedIn -funktiolla joka on tässä tiedostossa alinna
router.get('/profile', isLoggedIn, async function (req, res) {
  console.log(req.isAuthenticated()); // Passportin metodi joka tuottaa true jos Google auth onnistui
  // user saadaan Googlelle tehdyn pyynnön tuloksena req-oliossa
  // Se sisältää käyttäjän profiilin kts. konsolista
  console.log(req.user);
  const sess = req.session; //laitetaan sessio-olio muuttujaan sess

  // tässä voitaisiin viedä req.user tietokantaan jos kirjaudutaan tunnareilla ekaa kertaa

  await createUser(req, res);

  res.render('profile.hbs', {
    user: req.user, // user req-oliosta templaattiin
    sessid: sess.id, // viedään session id templaattiin
  });
});

/*
Googlen autentikaatioreitti
scope kuvaa Googlelta saatavaa dataa
profiilitiedot, ja email
*/
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

/*
callback -osoite jonne ohjataan Google-autentikaation jälkeen
tässä tapauksessa callback-osoitteesta mennään suoraan profile-sivulle
jossa näytetään profiilitiedot
*/
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/',
  }),
);

// logout
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// middleware jota käytetään autentikoitavissa reiteissä (tässä /profile -reitti)
function isLoggedIn(req, res, next) {
  console.log(req.isAuthenticated()); // tuottaa true jos Google auth onnistui
  // jos käyttäjä autentikoitunut, mennään eteenpäin
  if (req.isAuthenticated()) {
    return next(); // mennään isLoggedIn -funktiosta seuraavaan funktioon
  }
  // muuten mennään etusivulle
  res.redirect('/');
}

module.exports = router;
