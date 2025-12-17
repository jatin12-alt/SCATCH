const crypto = require('crypto');
const config = require('config');

const OWNER_PASSCODE =
  process.env.OWNER_PASSCODE || (config.has('OWNER_PASSCODE') ? config.get('OWNER_PASSCODE') : null);

// Simple in-memory session store for owner tokens
const ownerSessions = new Map();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getTokenFromRequest(req) {
  const headerToken = req.headers['x-owner-token'];
  const bearer = req.headers.authorization;
  if (headerToken) return String(headerToken);
  if (bearer && bearer.startsWith('Bearer ')) return bearer.slice(7);
  return null;
}

function validateOwnerToken(token) {
  if (!token) return false;
  const issuedAt = ownerSessions.get(token);
  if (!issuedAt) return false;
  if (Date.now() - issuedAt > SESSION_TTL_MS) {
    ownerSessions.delete(token);
    return false;
  }
  return true;
}

function requireOwnerAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!validateOwnerToken(token)) {
    return res.status(401).json({ message: 'Owner token missing, invalid, or expired.' });
  }
  req.ownerToken = token;
  next();
}

function createOwnerSession() {
  const token = crypto.randomBytes(24).toString('hex');
  ownerSessions.set(token, Date.now());
  return token;
}

function issueOwnerToken(passcode) {
  if (!OWNER_PASSCODE) return null;
  if (passcode !== OWNER_PASSCODE) return null;
  return createOwnerSession();
}

function revokeOwnerSession(token) {
  if (token) {
    ownerSessions.delete(token);
  }
}

module.exports = {
  requireOwnerAuth,
  requireOwner: requireOwnerAuth,
  createOwnerSession,
  issueOwnerToken,
  revokeOwnerSession,
  validateOwnerToken,
  SESSION_TTL_MS
};
