/*const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('recordings');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'recordings'
        };
    }
});

const upload = multer({ storage });

// 📌 Upload recorded video
router.post('/upload', upload.single('recording'), (req, res) => {
    res.json({ fileId: req.file.id, fileName: req.file.filename });
});

// 📌 Get all recordings
router.get('/recordings', async (req, res) => {
    try {
        const files = await gfs.files.find().toArray();
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Stream recording by ID
router.get('/recordings/:id', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;*/
