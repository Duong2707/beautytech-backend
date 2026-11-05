// 👇 THÊM 2 DÒNG NÀY ĐỂ FIX LỖI DNS TRÊN WINDOWS
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('./models/Notification'); 
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedNotifications = async () => {
  try {
    // Xóa thông báo cũ (nếu muốn làm sạch)
    await Notification.deleteMany();

    const mockNotifications = [
      {
        title: 'Tặng bạn mã BEAUTY50',
        content: 'Nhập mã BEAUTY50 để được giảm ngay 50.000đ cho đơn từ 200k. Bấm vào đây để dùng ngay!',
        type: 'promo',
        voucherCode: 'BEAUTY50',
        isRead: false,
      },
      {
        title: 'Chào mừng bạn mới',
        content: 'Nhập mã NEWBIE20 giảm 20.000đ cho mọi đơn hàng. Bấm vào đây để dùng ngay!',
        type: 'promo',
        voucherCode: 'NEWBIE20',
        isRead: false,
      },
      {
        title: 'Bảo trì hệ thống',
        content: 'Hệ thống sẽ bảo trì vào 12h đêm nay. Mong bạn thông cảm.',
        type: 'system',
        voucherCode: null,
        isRead: true,
      },
    ];

    await Notification.insertMany(mockNotifications);
    console.log('✅ Đã thêm thông báo mẫu thành công!');
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi khi thêm thông báo:', error);
    process.exit(1);
  }
};

seedNotifications();