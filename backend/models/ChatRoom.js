const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    isGroupChat: { 
      type: Boolean, 
      default: false 
    },
    name: { 
      type: String,
      required: true
    },
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User'
        },
        role: {
          type: String,
          required: true,
          enum: ['learner', 'instructor']
        }
      }
    ],
    type: {
      type: String,
      default: 'discussion',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: false, // Making this explicitly optional
      // You could alternatively use this for string IDs:
      // type: String,
    },
    academicOnly: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatRoom', chatRoomSchema);