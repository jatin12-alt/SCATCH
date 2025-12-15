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
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        // required: true,
    },
    products: {
        type: Array,
        default: [],
    },
    gstin: {
        type: String,
        // required: true,
    },
});

const owner = mongoose.model('owner', ownerSchema);

module.exports = owner;  