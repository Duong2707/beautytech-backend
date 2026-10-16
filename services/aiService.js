const axios = require('axios');
const FormData = require('form-data');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function analyzeSkin(imageBuffer, filename) {
  try {
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename });

    const response = await axios.post(`${AI_SERVICE_URL}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000,
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    console.error('AI Service error:', error.message);
    throw new Error('Không thể phân tích ảnh');
  }
}

module.exports = { analyzeSkin };