const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product-model');

const router = express.Router();

// Public endpoints
router.get('/', async (req, res) => {
  try {
    const { category, material, color, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (material) query.material = material;
    if (color) query.color = color;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch product', error: err.message });
  }
});

module.exports = router;