import mongoose from 'mongoose';

/**
 * STORE MODEL
 *
 * Represents a physical store location.
 * Stores are created and managed by business owners.
 * Each store can have multiple products, sales, and users assigned to it.
 *
 * Subscription limits:
 * - Starter/Basic: 1 store
 * - Pro: 3 stores
 * - Enterprise: 7 stores
 */

const storeSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      maxlength: [100, 'Store name cannot exceed 100 characters'],
    },

    // Contact Information
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },

    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    // Location
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: 'Nigeria',
      },
      postalCode: {
        type: String,
        trim: true,
      },
    },

    // Business Settings
    currency: {
      type: String,
      default: 'NGN',
      enum: ['NGN', 'USD', 'GBP', 'EUR'],
    },

    // Store Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Relationships
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      // Will be used when we implement business/subscription model
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Store must be created by a user'],
    },

    // Opening Hours (optional for future enhancement)
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },

    // Additional metadata
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    logo: {
      type: String, // URL to logo image
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
storeSchema.index({ createdBy: 1 });
storeSchema.index({ isActive: 1 });
storeSchema.index({ name: 1, createdBy: 1 });

// Virtual for full address
storeSchema.virtual('fullAddress').get(function () {
  if (!this.address) return '';

  const parts = [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.country,
  ].filter(Boolean);

  return parts.join(', ');
});

const Store = mongoose.model('Store', storeSchema);

export default Store;
