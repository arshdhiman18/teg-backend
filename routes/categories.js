const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const adminAuth = require('../middleware/auth');

const DEFAULT_CATEGORIES = [
  // Social & Home Celebrations
  { name: 'Birthday Decor', section: 'Social & Home Celebrations', subCategories: ['Kids Birthday'], tagline: 'Turn another year into a legendary celebration', detail: 'Balloon arches · Neon signs · Floral walls', accent: '#e879f9', gradientFrom: '#1a0a2e', gradientTo: '#2d1547', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=600&fit=crop&q=80', order: 1 },
  { name: 'Anniversary Decor', section: 'Social & Home Celebrations', subCategories: ['Silver Jubilee'], tagline: 'Celebrate years of love', detail: 'Intimate setups · Rose showers · Candlelight', accent: '#f87171', gradientFrom: '#2d1a1a', gradientTo: '#1a0d0d', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=600&fit=crop&q=80', order: 2 },
  { name: 'Baby Shower', section: 'Social & Home Celebrations', subCategories: [], tagline: 'Welcome little wonders', detail: 'Pastel themes · Balloon clouds · Floral arches', accent: '#86efac', gradientFrom: '#0d1f18', gradientTo: '#071410', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=600&fit=crop&q=80', order: 3 },
  { name: 'Newborn Welcome', section: 'Social & Home Celebrations', subCategories: [], tagline: 'First hello, forever memory', detail: 'Cozy setups · Soft pastels · Photo corners', accent: '#c4b5fd', gradientFrom: '#1a1a2d', gradientTo: '#0d0d1a', image: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400&h=600&fit=crop&q=80', order: 4 },
  { name: 'Proposal / Romantic Setup', section: 'Social & Home Celebrations', subCategories: [], tagline: 'The moment that changes everything', detail: 'Candles · Petal showers · Fairy lights', accent: '#c084fc', gradientFrom: '#2a1a2d', gradientTo: '#1a0d1f', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=600&fit=crop&q=80', order: 5 },
  { name: 'Bachelor / Bachelorette', section: 'Social & Home Celebrations', subCategories: [], tagline: 'Last night of freedom, legendary', detail: 'Neon vibes · Party décor · Theme nights', accent: '#f472b6', gradientFrom: '#1a0a1a', gradientTo: '#0d040d', image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=600&fit=crop&q=80', order: 6 },
  { name: 'Wedding & Traditional Events', section: 'Social & Home Celebrations', subCategories: ['Roka & Engagement', 'Haldi', 'Mehendi'], tagline: 'Where forever begins', detail: 'Mandaps · Floral drapes · Fairy lights', accent: '#C6A769', gradientFrom: '#1F3D3A', gradientTo: '#0d1f1c', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=600&fit=crop&q=80', order: 7 },
  { name: 'Specialized Setups', section: 'Social & Home Celebrations', subCategories: ['Table Setup / Centerpieces', 'Floral / Thematic', 'Traditional', 'Kids Theme', 'DJ, Sound & Lighting', 'Kids Activities'], tagline: 'Every detail, uniquely perfected', detail: 'Thematic · Floral · Traditional · Kids', accent: '#60a5fa', gradientFrom: '#0f1a2e', gradientTo: '#0a1020', image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=600&fit=crop&q=80', order: 8 },
  // Signature Events
  { name: 'Luxury Social Events', section: 'Signature Events', subCategories: [], tagline: 'Elegance, elevated', detail: 'Grand setups · VIP experiences · Bespoke design', accent: '#C6A769', gradientFrom: '#1F3D3A', gradientTo: '#0d1f1c', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=600&fit=crop&q=80', order: 1 },
  { name: 'Wedding Experiences', section: 'Signature Events', subCategories: [], tagline: 'A wedding unlike any other', detail: 'Destination · Luxury mandaps · Full design', accent: '#fbbf24', gradientFrom: '#2d1a1a', gradientTo: '#1a0d0d', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=600&fit=crop&q=80', order: 2 },
  { name: 'Experiential Events', section: 'Signature Events', subCategories: [], tagline: 'Immersive. Unforgettable.', detail: 'Club nights · Comedy · Workshops', accent: '#a78bfa', gradientFrom: '#1a0a2e', gradientTo: '#2d1547', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=600&fit=crop&q=80', order: 3 },
  { name: 'Corporate Events', section: 'Signature Events', subCategories: [], tagline: 'Impress. Inspire. Elevate.', detail: 'Brand setups · Awards nights · Team events', accent: '#60a5fa', gradientFrom: '#0f1a2e', gradientTo: '#0a1020', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop&q=80', order: 4 },
  { name: 'Spiritual Gatherings', section: 'Signature Events', subCategories: [], tagline: 'Sacred spaces, beautifully created', detail: 'Pujas · Ceremonies · Traditional décor', accent: '#fb923c', gradientFrom: '#2d1a0a', gradientTo: '#1a0d05', image: 'https://images.unsplash.com/photo-1561386369-8b3a51aefd14?w=400&h=600&fit=crop&q=80', order: 5 },
];

// Auto-seed default categories if none exist
const ensureDefaults = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log('✅ Default categories seeded');
  }
};

// GET /api/categories — all categories (for product form dropdowns)
router.get('/', async (req, res) => {
  try {
    await ensureDefaults();
    const categories = await Category.find().sort({ section: 1, order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/categories/active — only categories that have at least 1 product
router.get('/active', async (req, res) => {
  try {
    await ensureDefaults();
    const activeNames = await Product.distinct('category');
    const categories = await Category.find({ name: { $in: activeNames } }).sort({ section: 1, order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/categories — create new category (admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/categories/:id — update category (admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/categories/:id — delete category (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
