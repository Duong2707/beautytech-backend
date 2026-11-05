const Cart = require('../models/Cart');
const mongoose = require('mongoose'); // Cần thiết để kiểm tra ID

// Hàm hỗ trợ lấy User ID an toàn
const getUserId = (req) => {
  return req.user?._id || req.user?.id; 
};

// @desc    Lấy giỏ hàng của user
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Không tìm thấy thông tin User' });

    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('❌ [GET CART ERROR]:', error); // In lỗi ra Terminal
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Thêm sản phẩm vào giỏ
// @route   POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, quantity, size } = req.body;

    console.log(`👉 [ADD TO CART] User: ${userId}, Product: ${productId}, Qty: ${quantity}, Size: ${size}`);

    if (!userId) return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
       return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Tìm xem sản phẩm với size này đã có trong giỏ chưa
    const itemIndex = cart.items.findIndex(
      (item) => item.product && item.product.toString() === productId.toString() && item.size === size
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), size });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json({ success: true, data: populatedCart });
  } catch (error) {
    console.error('❌ [ADD TO CART ERROR]:', error); // In lỗi ra Terminal
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cập nhật số lượng hoặc trạng thái tick chọn
// @route   PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { itemId, quantity, selected } = req.body;
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    
    if (itemIndex > -1) {
      if (quantity !== undefined) cart.items[itemIndex].quantity = Number(quantity);
      if (selected !== undefined) cart.items[itemIndex].selected = selected;
      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json({ success: true, data: populatedCart });
  } catch (error) {
    console.error('❌ [UPDATE CART ERROR]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Xóa 1 sản phẩm khỏi giỏ
// @route   DELETE /api/cart/remove/:itemId
const removeCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json({ success: true, data: populatedCart });
  } catch (error) {
    console.error('❌ [REMOVE CART ERROR]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Xóa toàn bộ giỏ hàng
// @route   DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    res.status(200).json({ success: true, data: { items: [] } });
  } catch (error) {
    console.error('❌ [CLEAR CART ERROR]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };