const mongoose = require('mongoose');
const slugify = require('slugify');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
      trim: true,
    },
    endDate: {
      type: String,
      trim: true,
      default: '',
    },
    time: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    ageLimit: {
      type: String,
      trim: true,
      default: '',
    },
    language: {
      type: String,
      trim: true,
      default: '',
    },
    genre: {
      type: String,
      trim: true,
      default: '',
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    otherVenues: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    packages: {
      type: [
        {
          label: { type: String, trim: true },
          price: { type: Number, min: 0 },
        },
      ],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    fillingFast: {
      type: Boolean,
      default: false,
    },
    interestedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 0;
    while (true) {
      const existing = await mongoose.model('Event').findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      count++;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
