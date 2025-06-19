const axios = require('axios');

const verifyCaptcha = async (captchaResponse) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Get secret key from .env

  try {
    const result = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: captchaResponse,
      },
    });

    return result.data.success; // returns true if CAPTCHA is valid
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    return false;
  }
};

module.exports = { verifyCaptcha };
