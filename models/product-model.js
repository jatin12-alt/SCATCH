const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 80
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'General'
    },
    material: {
      type: String,
      default: 'Unknown'
    },
    color: {
      type: String,
      default: 'Multi'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    countInStock: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    image: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    dimensions: {
      w: { type: Number, min: 0 },
      h: { type: Number, min: 0 },
      d: { type: Number, min: 0 }
    },
    bgcolor: { type: String },
    panelcolor: { type: String },
    textcolor: { type: String }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;