const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const sampleProducts = [
  {
    title: 'Royal Garden Birthday Extravaganza',
    category: 'Birthday',
    price: 85000,
    discount: 10,
    budgetTag: 'Luxury',
    description:
      'Transform your birthday into a royal celebration with our garden-themed luxury setup. Lush floral arches, bespoke table arrangements, and ambient lighting create an unforgettable atmosphere for your special day.',
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    ],
    includes: [
      'Floral arch entrance (8ft x 6ft)',
      'Customized backdrop with name & age',
      'Table centerpieces (10 tables)',
      'Balloon arrangements (200+ balloons)',
      'Fairy light canopy',
      'Welcome signage board',
      'Setup & breakdown by our team',
    ],
    excludes: [
      'Catering & food arrangements',
      'Photography & videography',
      'Venue booking charges',
      'Sound system & DJ',
    ],
    featured: true,
  },
  {
    title: 'Celestial Wedding Mandap Package',
    category: 'Wedding',
    price: 250000,
    discount: 5,
    budgetTag: 'Luxury',
    description:
      'An ethereal wedding experience featuring a celestial-themed mandap adorned with cascading flowers, gold accents, and soft ambient lighting. Every detail is crafted to make your wedding day utterly magical.',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
    ],
    includes: [
      'Grand floral mandap with premium flowers',
      'Stage backdrop (20ft x 12ft)',
      'Aisle decoration with petals & candles',
      'Entry gate floral decoration',
      'Seating arrangement for 200 guests',
      'Bridal suite decoration',
      'Photo booth setup',
      'Dedicated event coordinator',
    ],
    excludes: [
      'Catering services',
      'Bridal & groom attire',
      'Invitations & stationery',
      'Music & entertainment',
    ],
    featured: true,
  },
  {
    title: 'Silver Jubilee Anniversary Setup',
    category: 'Anniversary',
    price: 45000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'Celebrate 25 years of love with a sophisticated silver and white themed anniversary setup. Elegant, intimate, and utterly romantic – designed to honor a lifetime of beautiful memories.',
    images: [
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=1200&q=80',
      'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=1200&q=80',
    ],
    includes: [
      'Silver & white themed backdrop',
      'Couple\'s table decoration',
      'Floral centrepieces (5 tables)',
      'Balloon pillar decorations',
      'LED number "25" standee',
      'Memory wall with photo frames',
      'Romantic candle pathway',
    ],
    excludes: [
      'Cake & catering',
      'Photography',
      'Venue rental',
    ],
    featured: false,
  },
  {
    title: 'Pastel Dream Baby Shower',
    category: 'Baby Shower',
    price: 28000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'Welcome the newest family member with a dreamy pastel-themed baby shower setup. Soft colors, charming décor elements, and personalized touches make this celebration truly heartwarming.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
    ],
    includes: [
      'Pastel balloon garland (15ft)',
      'Customized baby name backdrop',
      'Dessert table setup',
      'Diaper cake centerpiece',
      'Baby photo timeline display',
      'Guest book setup',
      'Gender reveal box (if applicable)',
    ],
    excludes: [
      'Cake & food',
      'Photography',
      'Return gifts',
      'Venue charges',
    ],
    featured: true,
  },
  {
    title: 'Executive Corporate Gala Night',
    category: 'Corporate',
    price: 150000,
    discount: 0,
    budgetTag: 'Luxury',
    description:
      'Elevate your corporate events with our premium gala night setup. Sophisticated branding integration, elegant décor, and professional ambiance that reflects your company\'s prestige and values.',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80',
    ],
    includes: [
      'Branded stage backdrop with company logo',
      'Red carpet entrance setup',
      'Premium table settings (up to 30 tables)',
      'Floral centerpieces for all tables',
      'Award ceremony podium setup',
      'Photo booth with branded frame',
      'Ambient LED uplighting',
      'Event signage & directionals',
    ],
    excludes: [
      'AV equipment & sound',
      'Catering services',
      'Printing & branding materials',
      'Venue booking',
    ],
    featured: false,
  },
  {
    title: 'Boho Chic Engagement Ceremony',
    category: 'Engagement',
    price: 55000,
    discount: 8,
    budgetTag: 'Premium',
    description:
      'A romantic boho-chic engagement setup with macramé backdrops, pampas grass, earthy tones, and warm fairy lights. Perfect for couples who love effortless, natural beauty in their celebrations.',
    images: [
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
    ],
    includes: [
      'Macramé backdrop (10ft x 8ft)',
      'Pampas grass & dried flower arrangements',
      'Ring ceremony table setup',
      'Couple\'s seating arrangement',
      'Fairy light curtain backdrop',
      'Floral arch for photos',
      'Welcome board with couple\'s name',
      'Boho-style table centerpieces',
    ],
    excludes: [
      'Catering & cake',
      'Photography & film',
      'Venue & furniture rental',
    ],
    featured: true,
  },
  {
    title: 'Simple & Sweet Birthday Bash',
    category: 'Birthday',
    price: 12000,
    discount: 0,
    budgetTag: 'Pocket',
    description:
      'A cheerful and vibrant birthday setup perfect for kids and adults alike. Bright colors, fun balloons, and a personalized touch that brings joy without breaking the bank.',
    images: [
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=1200&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80',
    ],
    includes: [
      'Colorful balloon backdrop',
      'Name & age display',
      'Table decoration with theme balloons',
      'Balloon bouquets (4 arrangements)',
      'Banner setup',
    ],
    excludes: [
      'Cake & food',
      'Photography',
      'Sound system',
    ],
    featured: false,
  },
  {
    title: 'Intimate Home Anniversary Décor',
    category: 'Anniversary',
    price: 18000,
    discount: 0,
    budgetTag: 'Pocket',
    description:
      'Transform your home into a romantic haven for your anniversary. Soft roses, candle arrangements, and personalized touches create the perfect intimate setting for two.',
    images: [
      'https://images.unsplash.com/photo-1561543706-5ef8be0c8943?w=1200&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1200&q=80',
    ],
    includes: [
      'Rose petal pathway',
      'Candle arrangement (floating & pillar)',
      'Balloon heart on bed/sofa',
      'Personalized backdrop (6ft x 4ft)',
      'Flower bouquet & vase',
      'LED lights setup',
    ],
    excludes: [
      'Dinner arrangements',
      'Photography',
      'Gifts',
    ],
    featured: false,
  },
  {
    title: 'Grand Destination Wedding Package',
    category: 'Wedding',
    price: 500000,
    discount: 0,
    budgetTag: 'Luxury',
    description:
      'The ultimate luxury wedding experience for destination celebrations. From the grand entrance to the final farewell, every element is meticulously crafted with the finest materials and most talented artisans.',
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
      'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=80',
    ],
    includes: [
      'Grand entrance gate (30ft) with flowers & draping',
      'Luxury mandap with imported flowers',
      'Full venue transformation',
      'Cocktail area decoration',
      'Sangeet night setup',
      'Mehndi ceremony décor',
      'Pheras & vidaai setup',
      'Honeymoon suite decoration',
      '2 dedicated coordinators for 3 days',
      'Floral car decoration',
    ],
    excludes: [
      'Venue, hotel & travel',
      'Catering & bar',
      'Trousseau & wedding attire',
      'Invitations',
      'Photography & film crew',
    ],
    featured: true,
  },
  {
    title: 'Tech Startup Product Launch',
    category: 'Corporate',
    price: 65000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'A sleek, modern event setup designed for product launches and corporate announcements. Clean lines, brand colors, and impactful visuals that make your launch moment unforgettable.',
    images: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80',
      'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=1200&q=80',
    ],
    includes: [
      'Custom brand backdrop (15ft x 10ft)',
      'Product display podium',
      'Press conference table setup',
      'Step & repeat banner',
      'LED ambient lighting',
      'Media check-in area',
      'Branded directional signage',
    ],
    excludes: [
      'AV & tech equipment',
      'Catering',
      'Invitations & PR',
      'Venue charges',
    ],
    featured: false,
  },
];

// POST /api/seed - Seed database with sample products
router.post('/', async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Save one by one to trigger pre-save hooks (slug generation)
    const saved = [];
    for (const p of sampleProducts) {
      const doc = new Product(p);
      await doc.save();
      saved.push(doc);
    }

    res.json({
      success: true,
      message: `Successfully seeded ${saved.length} products`,
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/seed - Check seed status
router.get('/', async (req, res) => {
  const count = await Product.countDocuments();
  res.json({ success: true, productCount: count, message: 'POST to this endpoint to seed data' });
});

module.exports = router;
