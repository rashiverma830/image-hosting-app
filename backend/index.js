require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:');
        console.error('Error Code:', err.code);
        console.error('Hostname:', err.hostname);
        console.error('Message:', err.message);
    });

// Define Schema and Model
const imageSchema = new mongoose.Schema({
    title: String,
    url: String,
    bid: { type: String, default: '0.00 ETH' },
    time: { type: String, default: '24h 00m' },
    createdAt: { type: Date, default: Date.now }
});
const Image = mongoose.model('Image', imageSchema);

// Create uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '-');
        cb(null, Date.now() + '-' + safeName);
    }
});

const upload = multer({ storage });

// Upload Endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const title = req.file.originalname.split('.')[0] || 'New Item';
    
    try {
        const newImage = new Image({
            title: title,
            url: fileUrl
        });
        await newImage.save();
        
        res.json({ 
            url: fileUrl,
            image: {
                id: newImage._id,
                title: newImage.title,
                bid: newImage.bid,
                time: newImage.time,
                img: newImage.url
            }
        });
    } catch (error) {
        console.error("MongoDB save failed, returning local file info anyway:", error.message);
        // Fallback to allow app to work even if DB is down
        res.json({
            url: fileUrl,
            image: {
                id: Date.now().toString(),
                title: title,
                bid: '0.00 ETH',
                time: '24h 00m',
                img: fileUrl
            }
        });
    }
});

// Fetch all images Endpoint
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        const formattedImages = images.map(img => ({
            id: img._id,
            title: img.title,
            bid: img.bid,
            time: img.time,
            img: img.url
        }));
        res.json(formattedImages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
