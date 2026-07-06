const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid company website URL',
      ],
    },
    logo: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid logo image URL',
      ],
    },
    industry: {
      type: String,
      required: [true, 'Industry type is required (e.g. IT, Finance, Consulting)'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Company description is required'],
      trim: true,
    },
    locations: [
      {
        type: String,
        trim: true,
      },
    ],
    establishedYear: {
      type: Number,
      min: [1700, 'Established year is too far in the past'],
      max: [new Date().getFullYear(), 'Established year cannot be in the future'],
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid contact email address',
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate middleware to auto-generate slug from name if not provided
CompanySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
      .replace(/(^-|-$)+/g, '');   // Trim leading/trailing hyphens
  }
  next();
});

// Indexes for query optimization:
// 1. Unique index on slug for SEO-friendly and fast URL routing (/companies/google)
CompanySchema.index({ slug: 1 });

// 2. Text index on name and description for search functionality
CompanySchema.index(
  {
    name: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 5,
      description: 2,
    },
    name: 'CompanySearchIndex',
  }
);

module.exports = mongoose.model('Company', CompanySchema);
