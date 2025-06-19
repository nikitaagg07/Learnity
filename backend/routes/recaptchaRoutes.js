const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);

    if (!response.data.success) {
      return res.status(400).json({ message: "CAPTCHA verification failed" });
    }

    res.status(200).json({ message: "CAPTCHA verified successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
});

module.exports = router;
