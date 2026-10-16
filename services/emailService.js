const nodemailer = require('nodemailer');

let transporter = null;

const initTransporter = async () => {
  if (transporter) return transporter;

  // Cấu hình Gmail chuẩn, tự động chọn cổng 465 (SSL) phù hợp
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password 16 ký tự, không dấu cách
    },
  });
  console.log('📧 Gmail transporter ready:', process.env.EMAIL_USER);

  return transporter;
};

const sendOtpEmail = async (toEmail, otp) => {
  const t = await initTransporter();

  const info = await t.sendMail({
    from: `"BeautyTech" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Mã OTP đặt lại mật khẩu - BeautyTech',
    html: `
      <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 20px;">
        <h2 style="color: #e76988;">Beauty Tech</h2>
        <p>Xin chào,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Đây là mã OTP của bạn:</p>
        <h1 style="color: #f5809d; letter-spacing: 10px; font-size: 36px;">${otp}</h1>
        <p>Mã có hiệu lực trong <b>5 phút</b>.</p>
        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      </div>
    `,
  });

  console.log('📧 Email đã gửi đến:', toEmail);
  return info;
};

module.exports = { sendOtpEmail };