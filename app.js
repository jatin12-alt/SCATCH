const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const mongooseConnection = require('./config/mongoose-connection');
const ownerRoutes = require('./routes/ownerRouter');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');

const db = require('./config/mongoose-connection');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/owner', ownerRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

app.listen(3000, () => {
    console.log(`Server is running on port 3000 http://localhost:3000`);
});2