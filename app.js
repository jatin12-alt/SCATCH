const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
require('./config/mongoose-connection');
const ownerRoutes = require('./routes/ownerRouter');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/owners', ownerRoutes);
app.use('/admin', ownerRoutes);

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/product', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});