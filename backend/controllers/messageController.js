const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
exports.createMessage = async (req, res) => {
    try {
      const { chatRoomId, senderId, senderModel, content } = req.body;
      const file = req.file ? `/uploads/${req.file.filename}` : null;
      const message = new Message({
        sender: senderId,
        senderModel,
        content,
        file,
        chatRoom: chatRoomId
      });
      console.log(message);
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getMessages = async (req, res) => {
    try {
      const messages = await Message.find({ chatRoom: req.params.chatRoomId }).populate('sender');
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  