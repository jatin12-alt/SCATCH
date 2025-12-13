const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    bgcolor: {
        type: String,
        required: true,
    },
    panelcolor: {
        type: String,
        required: true,
    },
    textcolor: {
        type: String,
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;