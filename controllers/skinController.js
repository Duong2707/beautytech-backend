const { analyzeSkin } = require('../services/aiService');
const SkinProfile = require('../models/SkinProfile');

// @desc    Phân tích ảnh da
// @route   POST /api/skin/analyze
// @access  Private
const analyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng upload ảnh',
      });
    }

    // Gọi AI service
    const result = await analyzeSkin(req.file.buffer, req.file.originalname);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Phân tích thất bại',
      });
    }

    // Lưu kết quả vào DB (tuỳ chọn)
    const skinProfile = await SkinProfile.create({
      userId: req.userId,
      skinCondition: result.skin_condition,
      confidence: result.confidence,
      analysisResult: result.probabilities,
    });

    res.status(200).json({
      success: true,
      message: 'Phân tích thành công',
      data: {
        skinCondition: result.skin_condition,
        confidence: result.confidence,
        probabilities: result.probabilities,
        profileId: skinProfile._id,
      },
    });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Lấy lịch sử phân tích
// @route   GET /api/skin/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const profiles = await SkinProfile.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { analyze, getHistory };