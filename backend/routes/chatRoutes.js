const express = require('express');
const router = express.Router();
const { 
  createChatRoom, 
  getUserChatRooms, 
  getChatMessages, 
  sendMessage 
} = require('../controllers/chatController');

router.post('/chatrooms', createChatRoom);
router.get('/chatrooms/:userId', getUserChatRooms);
router.get('/messages/:chatRoomId', getChatMessages);
router.post('/send-message', sendMessage);

module.exports = router;