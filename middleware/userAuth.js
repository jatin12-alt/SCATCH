const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

function requireUserAuth(req, res, next) {
  try {
    // Get token from cookie (set by login/register)
    const token = req.cookies.user_token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'user') {
      return res.status(403).json({ message: 'Access denied. User authentication required.' });
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid session. Please log in again.' });
    }
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
}

module.exports = {
  requireUserAuth,
  requireUser: requireUserAuth
};