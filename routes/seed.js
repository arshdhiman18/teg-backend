const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const sampleProducts = [

  // ─── SOCIAL & HOME CELEBRATIONS ────────────────────────────────────────

  // Birthday Decor — Luxury
  {
    title: 'Royal Garden Birthday Extravaganza',
    section: 'Social & Home Celebrations',
    category: 'Birthday Decor',
    subCategory: '',
    gender: 'Unisex',
    price: 85000,
    discount: 10,
    budgetTag: 'Luxury',
    description:
      'Transform your birthday into a royal garden celebration. Lush floral arches, bespoke table arrangements, and ambient lighting create an unforgettable atmosphere for your special day.',
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
    excludes: ['Catering & food', 'Photography & videography', 'Venue booking', 'Sound system & DJ'],
    featured: true,
  },

  // Birthday Decor — Kids Birthday (subcategory) — Pocket
  {
    title: 'Superhero Kids Birthday Blast',
    section: 'Social & Home Celebrations',
    category: 'Birthday Decor',
    subCategory: 'Kids Birthday',
    gender: 'Male',
    price: 14000,
    discount: 0,
    budgetTag: 'Pocket',
    description:
      'Let your little hero have the birthday party of their dreams! Vibrant superhero themed décor with custom balloons, activity corner, and a photo wall that kids absolutely love.',
    images: [
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=1200&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80',
    ],
    includes: [
      'Theme backdrop (6ft x 4ft)',
      'Character balloons & balloon arch',
      'Table & chair decoration',
      'Party banner with child\'s name',
      'Activity corner with face paint station',
      'Return gift packaging setup',
    ],
    excludes: ['Cake & food', 'Photography', 'Costume rentals'],
    featured: false,
  },

  // Birthday Decor — Girls themed — Premium
  {
    title: 'Enchanted Floral Birthday Soirée',
    section: 'Social & Home Celebrations',
    category: 'Birthday Decor',
    subCategory: '',
    gender: 'Female',
    price: 48000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'A dreamy floral-themed birthday celebration for the woman who loves beauty in every detail. Soft blush tones, cascading floral walls, and a personalised neon sign set the perfect mood.',
    images: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&q=80',
    ],
    includes: [
      'Floral balloon wall backdrop (8ft x 6ft)',
      'Customised neon sign',
      'Dessert table styling',
      'Balloon garland (20ft)',
      'Flower crown station',
      'Personalised banner',
    ],
    excludes: ['Catering', 'Photography', 'Venue charges'],
    featured: false,
  },

  // Anniversary Decor — Silver Jubilee — Premium
  {
    title: 'Silver Jubilee 25th Anniversary',
    section: 'Social & Home Celebrations',
    category: 'Anniversary Decor',
    subCategory: 'Silver Jubilee',
    gender: 'Unisex',
    price: 55000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'Celebrate 25 glorious years of togetherness. Elegant silver & white décor, a memory wall, and an intimate candlelit setup that honours every chapter of your beautiful love story.',
    images: [
      'https://images.unsplash.com/photo-1518048322571-a81d3b35e344?w=1200&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1200&q=80',
    ],
    includes: [
      'Silver & white themed backdrop',
      'Couple\'s table decoration',
      'Floral centrepieces (5 tables)',
      'LED number "25" standee',
      'Memory wall with photo frames',
      'Romantic candle pathway',
      'Balloon pillar arch',
    ],
    excludes: ['Cake & catering', 'Photography', 'Venue rental'],
    featured: true,
  },

  // Anniversary Decor — Pocket
  {
    title: 'Intimate Home Anniversary Candlelight',
    section: 'Social & Home Celebrations',
    category: 'Anniversary Decor',
    subCategory: '',
    gender: 'Unisex',
    price: 18000,
    discount: 0,
    budgetTag: 'Pocket',
    description:
      'Transform your home into a romantic haven. Rose petals, candle arrangements, and heartfelt personalised touches create the perfect intimate setting for two.',
    images: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
    ],
    includes: [
      'Rose petal pathway',
      'Floating & pillar candle arrangement',
      'Balloon heart arch on sofa',
      'Personalised backdrop (6ft x 4ft)',
      'Flower bouquet & vase',
      'LED fairy lights',
    ],
    excludes: ['Dinner arrangements', 'Photography', 'Gifts'],
    featured: false,
  },

  // Baby Shower — Premium
  {
    title: 'Pastel Dream Baby Shower',
    section: 'Social & Home Celebrations',
    category: 'Baby Shower',
    subCategory: '',
    gender: 'Unisex',
    price: 32000,
    discount: 5,
    budgetTag: 'Premium',
    description:
      'Welcome the newest family member with a dreamy pastel-themed baby shower. Soft colours, charming décor, and personalised touches make this celebration truly heartwarming.',
    images: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
    ],
    includes: [
      'Pastel balloon garland (15ft)',
      'Customised baby name backdrop',
      'Dessert table styling',
      'Diaper cake centrepiece',
      'Guest book setup',
      'Gender reveal box (if applicable)',
      'Photo timeline display',
    ],
    excludes: ['Cake & food', 'Photography', 'Return gifts', 'Venue charges'],
    featured: true,
  },

  // Newborn Welcome — Pocket
  {
    title: 'Sweet Beginnings Newborn Welcome',
    section: 'Social & Home Celebrations',
    category: 'Newborn Welcome',
    subCategory: '',
    gender: 'Unisex',
    price: 12000,
    discount: 0,
    budgetTag: 'Pocket',
    description:
      'Celebrate the arrival of your little one with a cosy, cloud-soft setup at home. Gentle pastels, a custom name board, and a dreamy photo corner for that first family portrait.',
    images: [
      'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=1200&q=80',
      'https://images.unsplash.com/photo-1590004845575-cc18b13b3d93?w=1200&q=80',
    ],
    includes: [
      'Soft cloud balloon arrangement',
      'Customised baby name board',
      'Cradle floral decoration',
      'Photo corner setup with props',
      'Welcome home banner',
    ],
    excludes: ['Photography', 'Catering', 'Return gifts'],
    featured: false,
  },

  // Proposal / Romantic Setup — Premium
  {
    title: 'Moonlit Rose Proposal Setup',
    section: 'Social & Home Celebrations',
    category: 'Proposal / Romantic Setup',
    subCategory: '',
    gender: 'Unisex',
    price: 35000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'The moment of a lifetime deserves perfection. A candlelit rose pathway, fairy light canopy, and a personalised "Will You Marry Me?" backdrop — every element curated to make the answer unforgettably "Yes".',
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
    ],
    includes: [
      'Rose petal pathway (20ft)',
      'Fairy light canopy (12ft x 10ft)',
      'Personalised proposal backdrop',
      'Red & white rose floral arch',
      'Candle arrangement (30 candles)',
      'Champagne flute setup',
      'Floating petal bath (if required)',
    ],
    excludes: ['Photographer / videographer', 'Ring & gifts', 'Venue booking', 'Food & cake'],
    featured: true,
  },

  // Bachelor / Bachelorette — Pocket
  {
    title: 'Neon Nights Bachelorette Bash',
    section: 'Social & Home Celebrations',
    category: 'Bachelor / Bachelorette',
    subCategory: '',
    gender: 'Female',
    price: 22000,
    discount: 0,
    budgetTag: 'Pocket',
    description:
      'Send her off in style! A fun, vibrant bachelorette setup with neon signs, disco balls, and personalised sashes that sets the tone for an epic last night of freedom.',
    images: [
      'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1200&q=80',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80',
    ],
    includes: [
      'Custom neon sign (bride\'s name)',
      'Disco ball installation',
      'Balloon garland & arch',
      'Party props & sash set',
      'Photo wall backdrop',
      'Personalised banner',
    ],
    excludes: ['Food & drinks', 'Photography', 'Party activities', 'Venue'],
    featured: false,
  },

  // Wedding & Traditional — Roka & Engagement — Luxury
  {
    title: 'Grand Roka & Engagement Ceremony',
    section: 'Social & Home Celebrations',
    category: 'Wedding & Traditional Events',
    subCategory: 'Roka & Engagement',
    gender: 'Unisex',
    price: 95000,
    discount: 5,
    budgetTag: 'Luxury',
    description:
      'Begin your forever with a grand Roka ceremony. Ornate floral décor, traditional elements, and luxurious styling that honours both families and sets the tone for the wedding ahead.',
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
    ],
    includes: [
      'Mandap-style stage setup',
      'Floral canopy & draping',
      'Ring ceremony table décor',
      'Aisle decoration with petals & candles',
      'Entry gate floral arch',
      'Seating for 150 guests',
      'Photo booth corner',
      'Dedicated event coordinator',
    ],
    excludes: ['Catering', 'Invitations', 'Photography', 'Venue booking'],
    featured: false,
  },

  // Wedding & Traditional — Haldi — Premium
  {
    title: 'Sunshine Haldi Ceremony Décor',
    section: 'Social & Home Celebrations',
    category: 'Wedding & Traditional Events',
    subCategory: 'Haldi',
    gender: 'Unisex',
    price: 42000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'Usher in the wedding with a joyful, vibrant Haldi setup. Marigold garlands, turmeric-yellow draping, and flower-filled urns create the most Instagrammable Haldi backdrop.',
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    ],
    includes: [
      'Marigold flower backdrop & draping',
      'Yellow & orange balloon arch',
      'Haldi ceremony stage for couple',
      'Floral urns & matkas (10 pieces)',
      'Petal pathway for entrance',
      'Floral photo booth corner',
    ],
    excludes: ['Haldi / turmeric', 'Catering', 'Photography', 'Attire'],
    featured: true,
  },

  // Specialized Setups — Floral / Thematic — Luxury
  {
    title: 'Bespoke Floral Thematic Setup',
    section: 'Social & Home Celebrations',
    category: 'Specialized Setups',
    subCategory: 'Floral / Thematic',
    gender: 'Unisex',
    price: 75000,
    discount: 0,
    budgetTag: 'Luxury',
    description:
      'A fully bespoke thematic setup built around your chosen concept — from all-white luxury to wild garden or vintage Parisian. Our design team creates a world unto itself, just for you.',
    images: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
    ],
    includes: [
      'Custom theme consultation & mood board',
      'Full venue floral transformation',
      'Statement centrepiece (custom design)',
      'Themed table settings (up to 20 tables)',
      'Backdrop & stage design',
      'Ambient lighting to match theme',
      'On-site design lead for the event day',
    ],
    excludes: ['Venue rental', 'Catering', 'Photography'],
    featured: true,
  },

  // Specialized Setups — Table Setup / Centerpieces — Premium
  {
    title: 'Signature Table & Centrepiece Package',
    section: 'Social & Home Celebrations',
    category: 'Specialized Setups',
    subCategory: 'Table Setup / Centerpieces',
    gender: 'Unisex',
    price: 38000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'Elevate your dining experience with bespoke table setups and breathtaking centrepieces. From intimate dinners to large banquets — every table tells a story.',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    ],
    includes: [
      'Custom floral centrepieces (up to 15 tables)',
      'Premium table runners & napkin folds',
      'Candle arrangements per table',
      'Menu card holders & place card setup',
      'Head table statement décor',
      'Charger plates & cutlery styling',
    ],
    excludes: ['Crockery & cutlery supply', 'Furniture rental', 'Catering'],
    featured: false,
  },

  // ─── SIGNATURE EVENTS ────────────────────────────────────────────────────

  // Luxury Social Events — Luxury
  {
    title: 'The Grand Soirée — Luxury Social Event',
    section: 'Signature Events',
    category: 'Luxury Social Events',
    subCategory: '',
    gender: 'Unisex',
    price: 350000,
    discount: 0,
    budgetTag: 'Luxury',
    description:
      'An ultra-premium social event experience for the discerning host. Museum-worthy installations, hand-imported florals, and a white-glove service team that makes every guest feel like royalty.',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80',
    ],
    includes: [
      'Full venue concept & transformation',
      'Bespoke floral installations (multi-room)',
      'Custom lighting design & programming',
      'Welcome experience (carpet + arch)',
      'Cocktail & lounge area styling',
      'Dedicated event director + team of 8',
      'Post-event breakdown & cleanup',
    ],
    excludes: ['Venue booking', 'Catering & bar', 'Entertainment', 'Invitations'],
    featured: true,
  },

  // Wedding Experiences — Luxury
  {
    title: 'Celestial Wedding Experience Package',
    section: 'Signature Events',
    category: 'Wedding Experiences',
    subCategory: '',
    gender: 'Unisex',
    price: 500000,
    discount: 0,
    budgetTag: 'Luxury',
    description:
      'The ultimate signature wedding — a 3-day design takeover covering every ceremony. Celestial florals, gold & ivory palette, and handcrafted elements that no guest will ever forget.',
    images: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
    ],
    includes: [
      'Grand entrance gate (30ft) with imported flowers',
      'Luxury mandap — custom design',
      'Mehendi & Haldi ceremony décor',
      'Sangeet night stage & lounge setup',
      'Cocktail hour floral design',
      'Reception venue full transformation',
      'Honeymoon suite decoration',
      '2 dedicated coordinators · 3 days',
      'Floral car decoration',
    ],
    excludes: ['Venue & hotel', 'Catering & bar', 'Photography & film', 'Invitations & attire'],
    featured: true,
  },

  // Experiential Events — Premium
  {
    title: 'Immersive Club Night Experience',
    section: 'Signature Events',
    category: 'Experiential Events',
    subCategory: '',
    gender: 'Unisex',
    price: 120000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'An experiential nightlife event unlike anything your guests have seen. Theatrical LED installations, a custom artist wall, and immersive zones designed to blur the line between décor and experience.',
    images: [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    ],
    includes: [
      'LED tunnel / immersive entrance',
      'Custom neon art installations (3 zones)',
      'Photo activation zone with props',
      'Lounge seating design & draping',
      'Themed bar area styling',
      'Brand / host name projection setup',
    ],
    excludes: ['Sound & lighting tech', 'Venue booking', 'Bar & food', 'Performers & artists'],
    featured: false,
  },

  // Corporate Events — Luxury
  {
    title: 'Executive Corporate Gala Night',
    section: 'Signature Events',
    category: 'Corporate Events',
    subCategory: '',
    gender: 'Unisex',
    price: 180000,
    discount: 0,
    budgetTag: 'Luxury',
    description:
      'Elevate your corporate gala with premium branded décor, sophisticated table settings, and a red-carpet entrance that makes every employee and stakeholder feel valued.',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80',
    ],
    includes: [
      'Branded stage backdrop with logo (20ft)',
      'Red carpet & stanchion entrance',
      'Premium table settings (up to 30 tables)',
      'Floral centrepieces for all tables',
      'Award ceremony podium setup',
      'Photo booth with branded frame',
      'Ambient LED uplighting',
      'Event signage & directionals',
    ],
    excludes: ['AV equipment & sound', 'Catering', 'Printing & branding', 'Venue'],
    featured: false,
  },

  // Corporate Events — Pocket
  {
    title: 'Startup Product Launch Setup',
    section: 'Signature Events',
    category: 'Corporate Events',
    subCategory: '',
    gender: 'Unisex',
    price: 65000,
    discount: 0,
    budgetTag: 'Premium',
    description:
      'A sleek, modern setup for product launches and corporate announcements. Clean lines, brand colours, and impactful visuals that make your launch moment unforgettable.',
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
    excludes: ['AV & tech equipment', 'Catering', 'Invitations & PR', 'Venue'],
    featured: false,
  },

  // Spiritual Gatherings — Pocket
  {
    title: 'Sacred Puja & Spiritual Ceremony Décor',
    section: 'Signature Events',
    category: 'Spiritual Gatherings',
    subCategory: '',
    gender: 'Unisex',
    price: 16000,
    discount: 0,
    budgetTag: 'Pocket',
    description:
      'Create a serene and sacred atmosphere for your puja, havan, or spiritual ceremony. Marigold torans, diya arrangements, and traditional décor elements designed with devotion.',
    images: [
      'https://images.unsplash.com/photo-1561386369-8b3a51aefd14?w=1200&q=80',
      'https://images.unsplash.com/photo-1603539947678-cd3954ed515d?w=1200&q=80',
    ],
    includes: [
      'Marigold toran & floral entrance',
      'Puja mandap decoration',
      'Diya & lamp arrangements',
      'Floral rangoli design',
      'Banana leaf & coconut ritual décor',
      'Backdrop with deity / occasion name',
    ],
    excludes: ['Puja samagri', 'Priest charges', 'Catering', 'Photography'],
    featured: false,
  },
];

// POST /api/seed
router.post('/', async (req, res) => {
  try {
    await Product.deleteMany({});
    const saved = [];
    for (const p of sampleProducts) {
      const doc = new Product(p);
      await doc.save();
      saved.push(doc);
    }
    res.json({ success: true, message: `Seeded ${saved.length} products`, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/seed
router.get('/', async (req, res) => {
  const count = await Product.countDocuments();
  res.json({ success: true, productCount: count, message: 'POST to this endpoint to seed data' });
});

module.exports = router;
