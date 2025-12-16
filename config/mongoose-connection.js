const mongoose = require('mongoose');
const config = require('config');

const dbgr = require('debug')('development:mongoose-connection');

// Prefer env var, fall back to config, and throw a clear error if missing
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  try {
    MONGODB_URI = config.get('MONGODB_URI');
  } catch (err) {
    console.error('MongoDB URI is missing. Set MONGODB_URI env or add it to config/default.json');
    throw err;
  }
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    dbgr('MongoDB connected successfully');
  })
  .catch((error) => {
    dbgr('MongoDB connection error', error);
  });

module.exports = mongoose.connection;