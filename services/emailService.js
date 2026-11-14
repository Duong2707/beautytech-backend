// src/services/emailService.js
const sendOtpEmail = async (toEmail, otp) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Chưa cấu hình BREVO_API_KEY trên Render');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY, 
      },
      body: JSON.stringify({
        sender: {
          name: 'BeautyTech',
          email: 'duongdt.23itb@vku.udn.vn', // 👈 ĐỔI THÀNH EMAIL BẠN ĐÃ XÁC THỰC Ở BƯỚC 2
        },
        to: [{ email: toEmail }],
        subject: 'Mã OTP đặt lại mật khẩu - BeautyTech',
        htmlContent: `
          <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 20px;">
            <h2 style="color: #e76988; text-align: center;">Beauty Tech</h2>
            <p>Xin chào,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Đây là mã OTP của bạn:</p>
            <h1 style="color: #f5809d; letter-spacing: 10px; font-size: 36px; text-align: center;">${otp}</h1>
            <p>Mã có hiệu lực trong <b>5 phút</b>.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Lỗi từ Brevo API:', errorData);
      throw new Error(errorData.message || 'Gửi email thất bại');
    }

    console.log('✅ Email OTP đã gửi thành công qua Brevo đến:', toEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail };