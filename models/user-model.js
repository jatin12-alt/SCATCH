const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/scatch");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true,
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
        minlength: 8,
    },
    cart: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    orders: {
        type: Array,
        default: [],
    },
    contact: {
        type: Number,
        required: true,
    },
    picture: {
        type: String,
        
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;