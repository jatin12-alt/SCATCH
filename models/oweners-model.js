const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
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
    },
    picture: {
        type: String,
    },
    products: {
        type: Array,
        default: [],
    },
    gstin: {
        type: String,
    },
}, { timestamps: true });

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;  