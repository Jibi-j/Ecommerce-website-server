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
app.use('/api', router);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/seller', require('./routes/sellerRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/review', require('./routes/reviewRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

connectDB();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
