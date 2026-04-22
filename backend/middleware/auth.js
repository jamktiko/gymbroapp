// TODO: Google Auth middleware
// Tämä korvataan kun Google OAuth otetaan käyttöön.

const authMiddleware = (req, res, next) => {
  // Kehitysvaiheessa: lue userId headerista tai querystä
  // HUOM: Älä käytä tätä tuotannossa
  const userId = req.headers['x-user-id'] || req.query.userId;

  if (userId) {
    req.user = { id: userId };
  } else {
    req.user = null;
  }

  next();
};

module.exports = authMiddleware;
