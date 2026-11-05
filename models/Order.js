const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Tạm thời để false để dễ test
  orderId: { type: String, required: true, unique: true }, 
  recipientName: String,
  phone: String,
  address: String,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      image: String,
      quantity: Number,
      size: String,
    }
  ],
  subTotal: Number,
  shippingFee: Number,
  discount: Number,
  total: Number,
  paymentMethod: { type: String, enum: ['cod', 'qr'] },
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid'], default: 'unpaid' },
  orderStatus: { type: String, default: 'pending' },
  
  // Trường lưu đánh giá
  rating: { type: Number, default: 0 },
  comment: { type: String, default: '' }
  
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);