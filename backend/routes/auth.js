const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  fetchDefaultProgramsForUser,
} = require('../controllers/trainingProgramsController');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = require('express').Router();

router.post('/google', async (req, res) => {
  try {
    // 1. Verifioi Googlen ID token

    console.log('help');
    const ticket = await client.verifyIdToken({
      idToken: req.body.gtoken,

      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, name, email } = ticket.getPayload();

    // 2. Luo tai hae käyttäjä

    let user = await User.findOne({ googleId: googleId });
    console.log('User found:', user);
    if (!user) {
      user = await User.create({
        googleId: googleId,
        name: name,
        email: email,
      });
      user = await fetchDefaultProgramsForUser(user._id);
    }

    // 3. Palauta oma JWT

    const token = jwt.sign(
      { userId: user._id, username: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    res.json({
      success: true,
      message: 'Tässä on valmis JWT-Token!',
      token,
      user,
    });
  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(401).json({ error: 'Virheellinen token' });
  }
});

module.exports = router;
