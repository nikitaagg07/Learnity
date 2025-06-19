const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
exports.createChatRoom = async (req, res) => {
  try {
    console.log('Chat room creation request:', req.body);
    
    const { users, isGroupChat, name, type, courseId, academicOnly } = req.body;
    
    if (!users || users.length < 1) {
      return res.status(400).json({ message: "At least one user is required" });
    }

    const chatRoom = new ChatRoom({
      users,
      isGroupChat: isGroupChat || false,
      name: name || 'Chat Room',
      type,         // Academic, discussion, etc.
      courseId,     // Optional: Attach to a course if relevant
      academicOnly  // Flag to mark as academic-only
    });

    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (error) {
    console.error("Chat room creation error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getUserChatRooms = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const rooms = await ChatRoom.find({ 'users.userId': userId });
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const chatRoomId = req.params.chatRoomId;
    
    const messages = await Message.find({ chatRoomId })
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatRoomId, senderId, senderRole, content } = req.body;
    
    if (!chatRoomId || !senderId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const newMessage = new Message({
      chatRoomId,
      senderId,
      senderRole,
      content
    });
    
    await newMessage.save();
    
    // Return the newly created message
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};