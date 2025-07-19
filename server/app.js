const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('✅ Payment Dashboard Backend is running. Use /api/* for API endpoints.');
});

module.exports = app;
