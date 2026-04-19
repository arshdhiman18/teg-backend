const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    section: {
      type: String,
      enum: ['Social & Home Celebrations', 'Signature Events'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unisex'],
      default: 'Unisex',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    images: {
      type: [String],
      default: [],
    },
    budgetTag: {
      type: String,
      enum: ['Pocket', 'Premium', 'Luxury'],
      required: [true, 'Budget tag is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    includes: {
      type: [String],
      default: [],
    },
    excludes: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 0;
    while (true) {
      const existing = await mongoose.model('Product').findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      count++;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
