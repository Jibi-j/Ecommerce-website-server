const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;
const connectDB = require('./config/db');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const clientUrl = process.env.CLIENT_DOMAIN;
const clientProdUrl = process.env.PROD_CLIENT_DOMAIN
app.use(cors({
  origin: [clientUrl,clientProdUrl],
  credentials: true
}));

// Routes
//app.use('/api', router);
app.use('/admin', require('./routes/adminRoutes'));
app.use('/seller', require('./routes/sellerRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/review', require('./routes/reviewRoutes'));
app.use('/payment', require('./routes/paymentRoutes'));
app.use('/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

connectDB();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
