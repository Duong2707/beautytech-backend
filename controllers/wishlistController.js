const Wishlist = require('../models/Wishlist');
const TEST_USER_ID = "65f1a2b3c4d5e6f7a8b9c0d1"; // Dùng tạm để test
const getUserId = (req) => (req.user && req.user.id ? req.user.id : TEST_USER_ID);

// 1. Lấy danh sách sản phẩm yêu thích
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: getUserId(req) }).populate('productId');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 2. Thêm / Bỏ yêu thích (Toggle)
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = getUserId(req);

    const existing = await Wishlist.findOne({ userId, productId });
    
    if (existing) {
      // Nếu đã có thì xóa (Bỏ yêu thích)
      await Wishlist.findByIdAndDelete(existing._id);
      res.json({ action: 'removed' });
    } else {
      // Nếu chưa có thì thêm (Yêu thích)
      await Wishlist.create({ userId, productId });
      res.json({ action: 'added' });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};