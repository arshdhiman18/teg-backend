const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    section: {
      type: String,
      required: true,
      enum: ['Social & Home Celebrations', 'Signature Events'],
    },
    subCategories: { type: [String], default: [] },
    image: { type: String, default: null },
    tagline: { type: String, default: '' },
    detail: { type: String, default: '' },
    accent: { type: String, default: '#C6A769' },
    gradientFrom: { type: String, default: '#1a0a2e' },
    gradientTo: { type: String, default: '#0d0d1a' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
