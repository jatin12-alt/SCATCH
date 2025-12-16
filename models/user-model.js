const mongoose = require('mongoose');

// Connection is handled centrally in config/mongoose-connection.js

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifyToken: {
      token: String,
      expires: Date
    },
    resetPasswordToken: {
      token: String,
      expires: Date
    },
    cart: {
      type: Array,
      default: []
    },
    orders: {
      type: Array,
      default: []
    },
    contact: {
      type: Number
    },
    picture: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
