const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user-model');
const Order = require('../models/order-model');
const Product = require('../models/product-model');
const { hashPassword, comparePassword, isStrongPassword } = require('../utils/auth');
const rateLimit = require('../middleware/rateLimit');
const { requireUserAuth } = require('../middleware/userAuth');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

// Helper to create JWT for users
function createUserToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
}

// Public route health check
router.get('/', (req, res) => {
  res.send('User Route');
});

// User registration - automatically authenticates user
router.post('/register', rateLimit({ windowMs: 60 * 1000, max: 5 }), async (req, res) => {
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

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // Auto-login: create JWT token and set cookie
    const token = createUserToken(user);

    res.cookie('user_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      message: 'User registered and logged in successfully',
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    console.error('Registration error', error);
    return res.status(500).json({ message: 'User registration failed', error: error.message });
  }
});

// User login
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

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create JWT token and set cookie
    const token = createUserToken(user);

    res.cookie('user_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      message: 'User logged in successfully',
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ message: 'User login failed', error: error.message });
  }
});

// Logout - clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('user_token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  return res.json({ message: 'User logged out successfully' });
});

// Protected user dashboard routes
// Get user profile and dashboard data
router.get('/dashboard', requireUserAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's orders
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-user')
      .populate('items.product', 'name image');

    // Return user data with orders
    const dashboardData = {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        picture: user.picture,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      orders: orders,
      cart: user.cart || []
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

// Update user profile
router.put('/profile', requireUserAuth, async (req, res) => {
  try {
    const { fullName, contact, picture } = req.body;

    // Validate input
    if (fullName && (fullName.length < 3 || fullName.length > 30)) {
      return res.status(400).json({ message: 'Full name must be between 3 and 30 characters' });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (contact !== undefined) updateData.contact = contact;
    if (picture !== undefined) updateData.picture = picture;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Profile update error', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Get user orders
router.get('/orders', requireUserAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');

    res.json({ orders });
  } catch (error) {
    console.error('Orders fetch error', error);
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Create order from cart
router.post('/orders', requireUserAuth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email ||
        !shippingAddress.phone || !shippingAddress.city || !shippingAddress.address) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    // Get user's cart
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem._id);
      if (!product) {
        return res.status(400).json({ message: `Product ${cartItem._id} not found` });
      }

      if (product.countInStock < cartItem.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.countInStock}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: product.price,
        quantity: cartItem.quantity
      });

      subtotal += product.price * cartItem.quantity;

      // Decrease stock
      product.countInStock -= cartItem.quantity;
      await product.save();
    }

    // Calculate shipping cost (simple logic - free over $100, otherwise $10)
    const shippingCost = subtotal > 100 ? 0 : 10;
    const totalAmount = subtotal + shippingCost;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      subtotal,
      shippingCost,
      totalAmount
    });

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Return created order
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name image');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Order creation error', error);
    return res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

module.exports = router;