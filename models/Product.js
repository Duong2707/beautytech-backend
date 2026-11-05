const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Tên sản phẩm là bắt buộc'], trim: true },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    category: { 
      type: String, 
      required: true, 
      enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'mask', 'treatment'] 
    },
    description: { type: String, default: '' },
    ingredients: { type: [String], default: [] },
    skinTypes: { type: [String], default: [] },
    concerns: { type: [String], default: [] },
    sizes: { type: [String], default: ['Mặc định'] }, // Trường mới thêm
    stock: { type: Number, default: 100 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);