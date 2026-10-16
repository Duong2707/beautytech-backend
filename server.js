// Fix lỗi querySrv ECONNREFUSED trên Windows
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối database
connectDB();

// ===== ROUTES =====
// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Skin analysis routes (AI)
const skinRoutes = require('./routes/skinRoutes');
app.use('/api/skin', skinRoutes);

// Product routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Route test
app.get('/', (req, res) => {
  res.json({
    message: 'BeautyTech API is running...',
    timestamp: new Date().toISOString(),
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});