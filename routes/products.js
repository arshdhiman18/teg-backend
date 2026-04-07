const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const slugify = require('slugify');
const Product = require('../models/Product');
const adminAuth = require('../middleware/auth');

// GET /api/products - Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, budgetTag, minPrice, maxPrice, featured, search, limit, page } = req.query;

    const filter = {};

    if (category) filter.category = category;
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

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id - Get single product by id or slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products - Create new product (admin only)
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

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // If title is being updated, regenerate slug
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

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
