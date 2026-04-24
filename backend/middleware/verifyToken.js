const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
} catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
}
};

module.exports = verifyToken;