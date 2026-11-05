const mongoose = require('mongoose');

const skinDiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  skinCondition: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  survey: {
    type: Object, // Lưu nguyên cục object khảo sát (type, concerns, age, routine, budget)
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('SkinDiary', skinDiarySchema);