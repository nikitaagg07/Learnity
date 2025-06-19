const express = require('express');
const router = express.Router();
const multer = require('multer');
const messageController = require('../controllers/messageController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/message', upload.single('file'), messageController.createMessage);
router.get('/messages/:chatRoomId', messageController.getMessages);

module.exports = router;