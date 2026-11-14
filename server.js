// Fix lỗi querySrv ECONNREFUSED trên Windows
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization']
}
));
app.use(express.json());
app.use('/api/users', require('./routes/userRoutes'));


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

const addressRoutes = require('./routes/addressRoutes');
app.use('/api/addresses', addressRoutes);

app.use('/api/notifications', require('./routes/notificationRoutes'));

// Cart routes
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const skinDiaryRoutes = require('./routes/skinDiaryRoutes');
app.use('/api/skin-diary', skinDiaryRoutes);

// 👇 KHAI BÁO ROUTE ORDER Ở ĐÂY
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Route thanh toán (SePay Webhook)
app.use('/api/payment', require('./routes/paymentRoutes'));

// 🌟 THÊM ROUTE VOUCHER Ở ĐÂY
const voucherRoutes = require('./routes/voucherRoutes'); // 👇 THÊM DÒNG NÀY
app.use('/api/vouchers', voucherRoutes); // 👇 THÊM DÒNG NÀY

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