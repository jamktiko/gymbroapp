// TODO: Google Auth middleware
// Tämä korvataan kun Google OAuth otetaan käyttöön.

const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/',
    session: false,
    failureMessage: true 
}), (req, res) => {
    const token = jwt.sign(
        { id: req.user._id, name: req.user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.json({ token }); // Tähän ionicin osoite tokenia varten. 
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});





module.exports = router;