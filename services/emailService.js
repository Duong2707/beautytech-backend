// src/services/emailService.js
const { Resend } = require('resend');

// Khởi tạo Resend với API Key (Đã cấu hình trên Render)
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (toEmail, otp) => {
  try {
    // Kiểm tra xem có API Key chưa để tránh lỗi ngầm
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ Chưa cấu hình RESEND_API_KEY trên Render!');
      throw new Error('Lỗi cấu hình email server');
    }

    const { data, error } = await resend.emails.send({
      // BẮT BUỘC dùng onboarding@resend.dev nếu chưa xác thực tên miền
      from: 'BeautyTech <onboarding@resend.dev>', 
      to: [toEmail],
      subject: 'Mã OTP đặt lại mật khẩu - BeautyTech',
      html: `
        <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #e76988; text-align: center;">Beauty Tech</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Đây là mã OTP của bạn:</p>
          <h1 style="color: #f5809d; letter-spacing: 10px; font-size: 36px; text-align: center;">${otp}</h1>
          <p>Mã có hiệu lực trong <b>5 phút</b>.</p>
          <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Lỗi từ Resend API:', error);
      throw new Error('Không thể gửi email OTP');
    }

    console.log('✅ Email OTP đã gửi thành công đến:', toEmail);
    return data;
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error);
    throw error;
  }
};

module.exports = { sendOtpEmail };