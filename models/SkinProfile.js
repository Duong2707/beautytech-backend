const mongoose = require('mongoose');

const skinProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skinCondition: {
      type: String,
      enum: ['Acne', 'Normal'],
      required: true,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    analysisResult: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkinProfile', skinProfileSchema);