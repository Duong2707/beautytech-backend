// beautytech-backend/controllers/addressController.js
const Address = require('../models/Address');

// 1. Lấy danh sách địa chỉ
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user._id; // 👈 Lấy ID thật từ token
    const addresses = await Address.find({ userId: userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    console.error("🔥 LỖI GET ADDRESS:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách địa chỉ" });
  }
};

// 2. Thêm địa chỉ mới
exports.addAddress = async (req, res) => {
  try {
    const { name, phone, address, isDefault } = req.body;
    const userId = req.user._id; // 👈 Lấy ID thật từ token
    
    // Nếu địa chỉ này là mặc định, set tất cả các địa chỉ khác của user thành false
    if (isDefault) {
      await Address.updateMany({ userId: userId }, { isDefault: false });
    }

    const newAddress = new Address({
      userId: userId, 
      name, 
      phone, 
      address, 
      isDefault: isDefault || false
    });
    
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    console.error("🔥 LỖI POST ADDRESS:", error);
    res.status(500).json({ message: "Lỗi server khi thêm địa chỉ" });
  }
};

// 3. Sửa địa chỉ
exports.updateAddress = async (req, res) => {
  try {
    const { name, phone, address, isDefault } = req.body;
    const userId = req.user._id; // 👈 Lấy ID thật từ token
    const addressId = req.params.id;
    
    // Nếu được set làm mặc định, reset các địa chỉ khác của CHÍNH user này
    if (isDefault) {
      await Address.updateMany({ userId: userId }, { isDefault: false });
    }

    // 👇 Thêm điều kiện userId vào để đảm bảo user chỉ sửa được địa chỉ của mình
    const updated = await Address.findOneAndUpdate(
      { _id: addressId, userId: userId }, 
      { name, phone, address, isDefault },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ để sửa hoặc bạn không có quyền." });
    }
    
    res.json(updated);
  } catch (error) {
    console.error("🔥 LỖI PUT ADDRESS:", error);
    res.status(500).json({ message: "Lỗi server khi sửa địa chỉ" });
  }
};

// 4. Xóa địa chỉ
exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user._id; // 👈 Lấy ID thật từ token
    
    // 👇 Thêm điều kiện userId để đảm bảo user chỉ xóa được địa chỉ của mình
    const deleted = await Address.findOneAndDelete({ _id: addressId, userId: userId });
    
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ để xóa hoặc bạn không có quyền." });
    }
    
    res.json({ message: "Đã xóa địa chỉ thành công" });
  } catch (error) {
    console.error("🔥 LỖI DELETE ADDRESS:", error);
    res.status(500).json({ message: "Lỗi server khi xóa địa chỉ" });
  }
};