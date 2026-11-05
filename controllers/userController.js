const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Address = require('../models/Address');
const SkinDiary = require('../models/SkinDiary');

// Xóa tài khoản và toàn bộ dữ liệu liên quan
exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Xóa tài khoản User
    await User.findByIdAndDelete(userId);

    // 2. Xóa các dữ liệu liên quan để tránh rác Database
    await Promise.all([
      Cart.findOneAndDelete({ user: userId }),
      Order.deleteMany({ userId: userId }),
      Address.deleteMany({ userId: userId }),
      SkinDiary.deleteMany({ user: userId })
    ]);

    res.json({ success: true, message: "Đã xóa tài khoản thành công" });
  } catch (error) {
    console.error("Lỗi xóa tài khoản:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};