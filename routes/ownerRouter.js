const express = require('express');
const rateLimit = require('../middleware/rateLimit');
const Owner = require('../models/oweners-model');
const Product = require('../models/product-model');
const { hashPassword, comparePassword } = require('../utils/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
const jwt = require('jsonwebtoken');

const createOwnerToken = (owner) => {
  return jwt.sign({ id: owner._id, email: owner.email, role: 'owner' }, JWT_SECRET, { expiresIn: '24h' });
};

const requireOwner = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.owner_token;
  if (!token) {
    return res.status(401).json({ message: 'Owner authentication required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'owner') {
      return res.status(403).json({ message: 'Owner access required' });
    }
    req.owner = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired owner token' });
  }
};

router.get('/', (req, res) => {
  res.send('Owner Route');
});

// One-time owner creation - only works if no owner exists
router.post('/create', async (req, res) => {
  try {
    // Check if owner already exists
    const existingOwner = await Owner.findOne();
    if (existingOwner) {
      return res.status(409).json({ message: 'Owner already exists. Cannot create another owner.' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const hashedPassword = await hashPassword(password);

    const owner = await Owner.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = createOwnerToken(owner);

    res.cookie('owner_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.status(201).json({
      message: 'Owner created successfully',
      owner: { id: owner._id, name: owner.name, email: owner.email }
    });
  } catch (error) {
    console.error('Owner creation error', error);
    return res.status(500).json({ message: 'Failed to create owner', error: error.message });
  }
});

// Owner login with email/password
router.post('/login', rateLimit({ windowMs: 60 * 1000, max: 5 }), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const owner = await Owner.findOne({ email: email.toLowerCase() });
    if (!owner) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await comparePassword(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = createOwnerToken(owner);

    res.cookie('owner_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.json({
      message: 'Owner logged in successfully',
      owner: { id: owner._id, name: owner.name, email: owner.email }
    });
  } catch (error) {
    console.error('Owner login error', error);
    return res.status(500).json({ message: 'Owner login failed', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('owner_token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  return res.json({ message: 'Owner logged out successfully' });
});

// Owner-only product management
router.get('/products', requireOwner, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

router.post('/products', requireOwner, upload.single('image'), async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.name || payload.price === undefined) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    // Handle uploaded file
    let imagePath = '';
    if (req.file) {
      imagePath = `/images/${req.file.filename}`;
    }

    const product = await Product.create({
      name: payload.name,
      description: payload.description || '',
      category: payload.category || 'General',
      price: payload.price,
      discount: payload.discount ?? 0,
      countInStock: payload.countInStock ?? 0,
      bgcolor: payload.bgcolor || '#eab308', // Default yellow
      image: imagePath,
      images: imagePath ? [imagePath] : []
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product', error: err.message });
  }
});

router.get('/products/:id', requireOwner, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch product', error: err.message });
  }
});

router.put('/products/:id', requireOwner, upload.single('image'), async (req, res) => {
  try {
    const payload = req.body || {};

    // Handle uploaded file if provided
    if (req.file) {
      payload.image = `/images/${req.file.filename}`;
      payload.images = [payload.image];
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product', error: err.message });
  }
});

router.delete('/products/:id', requireOwner, async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Product not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;