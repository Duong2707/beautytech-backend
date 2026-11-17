const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
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
  
  // 🌟 CẬP NHẬT: Thêm 'refunded' vào enum
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'pending', 'paid', 'refunded'], 
    default: 'unpaid' 
  },
  
  // 🌟 CẬP NHẬT: Thêm enum cho orderStatus và trạng thái 'cancel_requested'
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipping', 'delivered', 'reviewed', 'cancelled', 'cancel_requested'], 
    default: 'pending' 
  },
  
  // Trường lưu đánh giá
  rating: { type: Number, default: 0 },
  comment: { type: String, default: '' }
  
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);