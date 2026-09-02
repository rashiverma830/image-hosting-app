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

const subscriptionSchema = new mongoose.Schema({
    planName: String,
    billingCycle: String,
    price: String,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});
const Subscription = mongoose.model('Subscription', subscriptionSchema);

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
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
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
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected, using fallback immediately.');
        }
        
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
        const fallbackId = Date.now().toString();
        const fallbackImg = {
            id: fallbackId,
            title: title,
            bid: '0.00 ETH',
            time: '24h 00m',
            img: fileUrl
        };
        fallbackImages.unshift(fallbackImg); // Add to memory
        
        res.json({
            url: fileUrl,
            image: fallbackImg
        });
    }
});

// Fallback in-memory storage for when MongoDB is down
let fallbackImages = [];

// Fetch all images Endpoint
app.get('/api/images', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected, using fallback immediately.');
        }
        const images = await Image.find().sort({ createdAt: -1 });
        const formattedImages = images.map(img => ({
            id: img._id.toString(),
            title: img.title,
            bid: img.bid,
            time: img.time,
            img: img.url
        }));
        // Combine DB images with fallback images
        res.json([...fallbackImages, ...formattedImages]);
    } catch (error) {
        // If DB fails entirely, return fallback images
        console.error("Failed to fetch from MongoDB:", error.message);
        res.json(fallbackImages);
    }
});

// Delete image Endpoint
app.delete('/api/images/:id', async (req, res) => {
    try {
        const imageId = req.params.id;
        
        // Remove from memory if it exists there
        const fallbackIndex = fallbackImages.findIndex(img => img.id === imageId);
        let imageUrl = null;
        
        if (fallbackIndex !== -1) {
            imageUrl = fallbackImages[fallbackIndex].img;
            fallbackImages.splice(fallbackIndex, 1);
        } else {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database not connected, cannot delete from DB.');
            }
            const image = await Image.findByIdAndDelete(imageId);
            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }
            imageUrl = image.url;
        }

        // Optional: delete from filesystem using fs.unlink if it's a local file
        if (imageUrl && imageUrl.includes('/uploads/')) {
            const filename = imageUrl.split('/uploads/')[1];
            const filepath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Subscription Endpoint
app.post('/api/subscribe', async (req, res) => {
    try {
        const { planName, billingCycle, price } = req.body;
        const newSub = new Subscription({ planName, billingCycle, price });
        await newSub.save();
        res.json({ success: true, message: `Successfully subscribed to ${planName} plan!` });
    } catch (error) {
        console.error("Subscription failed:", error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
