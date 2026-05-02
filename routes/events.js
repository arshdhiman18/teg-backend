const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const slugify = require('slugify');
const Event = require('../models/Event');
const adminAuth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

const extractPublicId = (url) => {
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const path = parts[1].replace(/^v\d+\//, '');
  return path.replace(/\.[^/.]+$/, '');
};

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const { genre, featured, search, limit, page } = req.query;

    const filter = {};
    if (genre) filter.genre = genre;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 500;
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Event.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: pageNum, pages: Math.ceil(total / limitNum), data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let event;
    if (mongoose.Types.ObjectId.isValid(id)) event = await Event.findById(id);
    if (!event) event = await Event.findOne({ slug: id });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/events
router.post('/', adminAuth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'An event with this title already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/events/:id
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.title) {
      let baseSlug = slugify(req.body.title, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 0;
      while (true) {
        const existing = await Event.findOne({ slug, _id: { $ne: id } });
        if (!existing) break;
        count++;
        slug = `${baseSlug}-${count}`;
      }
      req.body.slug = slug;
    }
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/events/:id/interest — increment interestedCount
router.patch('/:id/interest', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $inc: { interestedCount: 1 } },
      { new: true }
    );
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, interestedCount: event.interestedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.images?.length > 0) {
      const deletePromises = event.images.map(extractPublicId).filter(Boolean).map((publicId) => cloudinary.uploader.destroy(publicId));
      await Promise.all(deletePromises);
    }
    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
