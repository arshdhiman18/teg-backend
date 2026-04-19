const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('../config/cloudinary');
const adminAuth = require('../middleware/auth');

// Use memory storage for multer, then upload to Cloudinary manually
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Compress image before upload — resize to max 1200x900, quality 85
const compressImage = async (buffer, mimetype) => {
  const instance = sharp(buffer).resize({ width: 1200, height: 900, fit: 'inside', withoutEnlargement: true });
  if (mimetype === 'image/png') return instance.png({ quality: 85 }).toBuffer();
  if (mimetype === 'image/webp') return instance.webp({ quality: 85 }).toBuffer();
  return instance.jpeg({ quality: 85 }).toBuffer();
};

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'teg-events', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload - Upload up to 10 images (admin only)
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const compressed = await compressImage(file.buffer, file.mimetype);
      return uploadToCloudinary(compressed);
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map((result) => result.secure_url);

    res.json({
      success: true,
      urls,
      message: `${urls.length} image(s) uploaded successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
