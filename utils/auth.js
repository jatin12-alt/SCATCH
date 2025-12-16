const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const SALT_ROUNDS = 12;

// Hash plain text password
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Compare password attempt with hash
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate random token
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Strong password validation
function isStrongPassword(password) {
  // Minimum 8 chars, 1 uppercase, 1 number
  return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

module.exports = { hashPassword, comparePassword, generateToken, isStrongPassword };
