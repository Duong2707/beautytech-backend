const SkinDiary = require('../models/SkinDiary');

// Lấy tất cả nhật ký của user
exports.getDiary = async (req, res) => {
  try {
    const userId = req.user._id; // 👈 Lấy ID thật từ Token
    const history = await SkinDiary.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Thêm một bản ghi mới
exports.addDiary = async (req, res) => {
  try {
    const userId = req.user._id; // 👈 Lấy ID thật từ Token
    const { skinCondition, confidence, survey } = req.body;
    
    const newEntry = await SkinDiary.create({
      user: userId,
      skinCondition,
      confidence,
      survey
    });
    
    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa một bản ghi
exports.deleteDiary = async (req, res) => {
  try {
    const userId = req.user._id; // 👈 Lấy ID thật từ Token
    const deleted = await SkinDiary.findOneAndDelete({ _id: req.params.id, user: userId });
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hoặc không có quyền xóa' });
    }
    res.status(200).json({ success: true, message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa toàn bộ
exports.clearDiary = async (req, res) => {
  try {
    const userId = req.user._id; // 👈 Lấy ID thật từ Token
    await SkinDiary.deleteMany({ user: userId });
    res.status(200).json({ success: true, message: 'Đã xóa toàn bộ' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};