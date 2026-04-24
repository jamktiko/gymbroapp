// TODO: Google Auth middleware
// Tämä korvataan kun Google OAuth otetaan käyttöön.

const authMiddleware = (req, res, next) => {
  // Kehitysvaiheessa: lue userId headerista
  // HUOM: Älä käytä tätä tuotannossa
  const userId = req.headers['x-user-id'] || req.query.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = { id: userId };
  next();
};

module.exports = authMiddleware;
