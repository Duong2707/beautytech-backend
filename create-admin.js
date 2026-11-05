const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load các biến môi trường từ file .env

// Import model Admin (trỏ đúng đường dẫn tới file Admin.js của bạn)
const Admin = require('./models/Admin');

// ⚠️ LƯU Ý: Thay chuỗi kết nối bên dưới bằng biến môi trường trong file .env của bạn
// Thường sẽ là process.env.MONGODB_URI hoặc process.env.MONGO_URI
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/beautytech';

const createAdminAccount = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Đã kết nối tới Database');

    // Kiểm tra xem tài khoản admin đã tồn tại chưa
    const existingAdmin = await Admin.findOne({ email: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Tài khoản admin đã tồn tại trong database!');
      process.exit(0);
    }

    // Tạo tài khoản mới (Mật khẩu sẽ tự động được hash bởi pre-save hook trong Admin.js)
    await Admin.create({
      email: 'admin',
      password: 'admin',
      fullName: 'Super Admin',
      role: 'admin'
    });

    console.log('🎉 Tạo tài khoản Admin thành công!');
    console.log('👉 Email đăng nhập: admin');
    console.log('👉 Mật khẩu: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi tạo tài khoản Admin:', error);
    process.exit(1);
  }
};

createAdminAccount();