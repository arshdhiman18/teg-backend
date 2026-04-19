const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const slugify = require('slugify');
const Product = require('../models/Product');
const adminAuth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

const extractPublicId = (url) => {
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const path = parts[1].replace(/^v\d+\//, '');
  return path.replace(/\.[^/.]+$/, '');
};

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, section, subCategory, gender, budgetTag, minPrice, maxPrice, featured, search, limit, page } = req.query;

    const filter = {};

    if (category) {
      const cats = category.split(',').map((c) => c.trim()).filter(Boolean);
      filter.category = cats.length === 1 ? cats[0] : { $in: cats };
    }
    if (section) filter.section = section;
    if (subCategory) filter.subCategory = subCategory;
    if (gender) filter.gender = gender;
    if (budgetTag) filter.budgetTag = budgetTag;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: pageNum, pages: Math.ceil(total / limitNum), data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) product = await Product.findById(id);
    if (!product) product = await Product.findOne({ slug: id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products
router.post('/', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A product with this title already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.title) {
      let baseSlug = slugify(req.body.title, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 0;
      while (true) {
        const existing = await Product.findOne({ slug, _id: { $ne: id } });
        if (!existing) break;
        count++;
        slug = `${baseSlug}-${count}`;
      }
      req.body.slug = slug;
    }
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.images?.length > 0) {
      const deletePromises = product.images.map(extractPublicId).filter(Boolean).map((publicId) => cloudinary.uploader.destroy(publicId));
      await Promise.all(deletePromises);
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
