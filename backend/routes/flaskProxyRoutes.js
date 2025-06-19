const express = require("express");
const axios = require("axios");
const router = express.Router();

const FLASK_SERVER_URL = "http://127.0.0.1:5000";

// Add timeout to avoid hanging requests
const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
});

// Translation endpoint
router.post("/translate", async (req, res) => {
  try {
    // Validate request body
    const { text, target_language } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Text is required for translation" });
    }
    
    // Call Flask service
    const response = await axiosInstance.post(`${FLASK_SERVER_URL}/translate`, {
      text,
      target_language: target_language || 'en'
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Translation Error:", error.message);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({ 
        message: "Translation service error", 
        details: error.response.data 
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({ 
        message: "Translation service unavailable. Please check if the Flask server is running." 
      });
    } else {
      // Something happened in setting up the request
      return res.status(500).json({ 
        message: "Translation request failed", 
        details: error.message 
      });
    }
  }
});

// Text-to-speech endpoint
router.post("/speak", async (req, res) => {
  try {
    // Validate request body
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Text is required for speech synthesis" });
    }
    
    // Call Flask service
    const response = await axiosInstance.post(`${FLASK_SERVER_URL}/speak`, { text });
    
    res.json(response.data);
  } catch (error) {
    console.error("Speech Error:", error.message);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({ 
        message: "Speech service error", 
        details: error.response.data 
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({ 
        message: "Speech service unavailable. Please check if the Flask server is running." 
      });
    } else {
      // Something happened in setting up the request
      return res.status(500).json({ 
        message: "Speech request failed", 
        details: error.message 
      });
    }
  }
});

module.exports = router;