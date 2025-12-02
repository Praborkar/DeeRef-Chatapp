const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  // ⭐ FIX: Skip auth for OPTIONS preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  const authHeader = req.header('Authorization') || req.header('authorization');

  console.log("AUTH HEADER RECEIVED:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
