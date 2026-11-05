const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const brands = ["La Roche-Posay", "Cerave", "Cetaphil", "Klairs", "The Ordinary", "Obagi", "Innisfree", "Simple", "Bioderma", "Hada Labo", "BeautyTech", "L'Oreal"];
const categories = ["cleanser", "toner", "serum", "moisturizer", "sunscreen", "mask", "treatment"];
const sizesList = [['15ml', '30ml', '50ml'], ['100ml', '150ml', '200ml'], ['30g', '50g', '80g'], ['Mặc định']];
const skinTypes = [["Da dầu"], ["Da khô"], ["Da hỗn hợp"], ["Da nhạy cảm"], ["Mọi loại da"]];
const concerns = [["Mụn ẩn"], ["Thâm mụn"], ["Lỗ chân lông to"], ["Lão hóa"], ["Thiếu ẩm"], ["Da xỉn màu"]];

const productNames = {
  cleanser: ["Sữa rửa mặt", "Gel rửa mặt", "Dầu tẩy trang", "Sữa rửa mặt tạo bọt"],
  toner: ["Nước hoa hồng", "Lotion cân bằng", "Toner làm sạch sâu"],
  serum: ["Serum dưỡng sáng", "Serum B5", "Serum Vitamin C", "Serum trị mụn", "Tinh chất phục hồi"],
  moisturizer: ["Kem dưỡng ẩm", "Gel dưỡng da", "Kem dưỡng phục hồi", "Kem lót trang điểm"],
  sunscreen: ["Kem chống nắng", "Xịt chống nắng", "Kem chống nắng nâng tông"],
  mask: ["Mặt nạ giấy", "Mặt nạ đất sét", "Mặt nạ ngủ", "Mặt nạ rửa"],
  treatment: ["Gel trị mụn", "Kem trị thâm", "Tinh chất trị mụn", "Miếng dán mụn"]
};

// ĐÃ CẬP NHẬT: Link ảnh mỹ phẩm chất lượng cao, ổn định
const images = [
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80",
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProducts = () => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    const category = getRandom(categories);
    const brand = getRandom(brands);
    const namePrefix = getRandom(productNames[category]);
    
    const price = getRandomInt(5, 150) * 10000;
    const originalPrice = Math.random() > 0.5 ? price + 50000 : 0;

    products.push({
      name: `${namePrefix} ${brand} ${getRandomInt(1, 9)}`,
      brand: brand,
      price: price,
      originalPrice: originalPrice,
      image: getRandom(images),
      category: category,
      description: `Sản phẩm ${namePrefix.toLowerCase()} chính hãng từ ${brand}. Giúp chăm sóc và bảo vệ làn da hiệu quả.`,
      sizes: getRandom(sizesList),
      skinTypes: getRandom(skinTypes),
      concerns: getRandom(concerns),
      rating: (Math.random() * 2 + 3).toFixed(1),
      sold: getRandomInt(10, 5000),
      stock: getRandomInt(50, 500),
    });
  }
  return products;
};

const importData = async () => {
  try {
    await Product.deleteMany(); 
    const massiveData = generateProducts();
    await Product.insertMany(massiveData); 
    console.log(`✅ Đã đổ thành công ${massiveData.length} sản phẩm vào Database!`);
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi khi đổ dữ liệu:', error);
    process.exit(1);
  }
};

importData();