const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {

          try {
            let user = await User.findOne({ googleId: profile.id });
            console.log('User found:', user);
            if (!user) {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
              });
              user = await fetchDefaultProgramsForUser(user._id);
            }
            done(null, user);
          } catch (err) {
            done(err, null);
          }

    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = verifyToken;
