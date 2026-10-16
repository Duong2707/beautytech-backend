require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
  console.log('=== DEBUG INFO ===');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
  console.log('EMAIL_PASS raw:', JSON.stringify(process.env.EMAIL_PASS));
  console.log('==================');

  const t = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await t.verify();
    console.log('✅ Gmail login THÀNH CÔNG');
  } catch (e) {
    console.log('❌ LỖI:', e.message);
  }
}

test();