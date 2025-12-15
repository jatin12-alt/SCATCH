const mongoose = require('mongoose');
const config = require('config');

const dbgr = require('debug')('development:mongoose-connection');

// Get MongoDB URI from config
const MONGODB_URI = config.get('MONGODB_URI');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    dbgr('MongoDB connected successfully');
  })
  .catch((error) => {
    dbgr('MongoDB connection error', error);
  });

module.exports = mongoose.connection;