const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user-model');
const { hashPassword, comparePassword, generateToken, isStrongPassword } = require('../utils/auth');
const sendEmail = require('../utils/sendEmail');
const rateLimit = require('../middleware/rateLimit');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '30d';

// Helper to create JWT
function createAccessToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Public route health check
router.get('/', (req, res) => {
  res.send('User Route');
});

// Registration with email verification
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one capital letter and one number.'
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const hashed = await hashPassword(password);
    const verificationToken = generateToken(32);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      isVerified: false,
      verifyToken: {
        token: verificationToken,
        expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    });

    const verifyUrl = `${req.protocol}://${req.get('host')}/user/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your TaskFlow account',
      html: `<p>Hi ${user.fullName},</p>
             <p>Thanks for signing up for TaskFlow. Please verify your email by clicking the link below:</p>
             <p><a href="${verifyUrl}">Verify my email</a></p>
             <p>This link will expire in 1 hour.</p>`
    });

    return res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Signup error', error);
    return res.status(500).json({ message: 'User not created', error: error.message });
  }
});

// Email verification
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Verification token is required.' });

    const user = await User.findOne({
      'verifyToken.token': token,
      'verifyToken.expires': { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Verification token is invalid or has expired.' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    return res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verify email error', error);
    return res.status(500).json({ message: 'Could not verify email', error: error.message });
  }
});

// Login with rate limiting
router.post('/login', rateLimit({ windowMs: 60 * 1000, max: 5 }), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const accessToken = createAccessToken(user);

    res.cookie('taskflow_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000
    });

    return res.json({
      message: 'User logged in successfully',
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ message: 'User not logged in', error: error.message });
  }
});

// Logout - clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('taskflow_token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  return res.json({ message: 'User logged out successfully' });
});

// Forgot password
router.post('/forgot-password', rateLimit({ windowMs: 60 * 1000, max: 5 }), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond the same to avoid leaking account existence
    if (!user) {
      return res.json({ message: 'If an account exists for this email, a reset link has been sent.' });
    }

    const resetToken = generateToken(32);
    user.resetPasswordToken = {
      token: resetToken,
      expires: new Date(Date.now() + 60 * 60 * 1000)
    };
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/user/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your TaskFlow password',
      html: `<p>Hi ${user.fullName},</p>
             <p>You requested to reset your TaskFlow password. Click the link below to set a new password:</p>
             <p><a href="${resetUrl}">Reset my password</a></p>
             <p>If you did not request this, you can ignore this email.</p>`
    });

    return res.json({ message: 'If an account exists for this email, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error', error);
    return res.status(500).json({ message: 'Could not start password reset', error: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one capital letter and one number.'
      });
    }

    const user = await User.findOne({
      'resetPasswordToken.token': token,
      'resetPasswordToken.expires': { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    await user.save();

    return res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error', error);
    return res.status(500).json({ message: 'Could not reset password', error: error.message });
  }
});

module.exports = router;