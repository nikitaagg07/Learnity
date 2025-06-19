const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ChatRoom'
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    senderRole: {
      type: String,
      required: true,
      enum: ['learner', 'instructor']
    },
    content: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);