const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  // Unique request identifier
  requestId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  // The user who submitted the request
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Producer is required'],
    index: true
  },
  // The certifier who will review this request
  assignedCertifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  // Request status
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  // Production details
  productionDate: {
    type: Date,
    required: [true, 'Production date is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Production date cannot be in the future'
    },
    index: true
  },
  energyAmountMWh: {
    type: Number,
    required: [true, 'Energy amount is required'],
    min: [0.1, 'Energy amount must be at least 0.1 MWh'],
    max: [10000, 'Energy amount cannot exceed 10,000 MWh']
  },
  energySource: {
    type: String,
    enum: {
      values: ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Other'],
      message: 'Energy source must be Solar, Wind, Hydro, Geothermal, Biomass, or Other'
    },
    required: [true, 'Energy source is required']
  },
  facilityName: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true,
    maxlength: [200, 'Facility name cannot exceed 200 characters']
  },
  facilityLocation: {
    type: String,
    required: [true, 'Facility location is required'],
    trim: true,
    maxlength: [200, 'Facility location cannot exceed 200 characters']
  },
  // Documentation
  proofDocumentUrl: {
    type: String,
    required: [true, 'Proof document is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Proof document must be a valid URL'
    }
  },
  additionalDocuments: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Document URL must be valid'
      }
    },
    type: {
      type: String,
      enum: ['Certificate', 'Report', 'Image', 'Other'],
      default: 'Other'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Review details
  review: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    comments: {
      type: String,
      maxlength: [1000, 'Comments cannot exceed 1000 characters']
    },
    rejectionReason: {
      type: String,
      enum: ['Insufficient Documentation', 'Invalid Data', 'Facility Not Certified', 'Other'],
      default: null
    },
    rejectionDetails: {
      type: String,
      maxlength: [500, 'Rejection details cannot exceed 500 characters']
    }
  },
  // Notification tracking
  notifications: {
    certifierNotified: {
      type: Boolean,
      default: false
    },
    producerNotified: {
      type: Boolean,
      default: false
    },
    lastNotificationSent: {
      type: Date,
      default: null
    }
  },
  // Metadata
  metadata: {
    priority: {
      type: String,
      enum: ['Low', 'Normal', 'High', 'Urgent'],
      default: 'Normal'
    },
    tags: [String],
    estimatedReviewTime: {
      type: Number, // in hours
      default: 24
    },
    source: {
      type: String,
      enum: ['Web Portal', 'API', 'Mobile App', 'Bulk Upload'],
      default: 'Web Portal'
    }
  },
  // Audit trail
  audit: {
    submittedAt: {
      type: Date,
      default: Date.now
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    version: {
      type: Number,
      default: 1
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
RequestSchema.index({ producer: 1, status: 1 });
RequestSchema.index({ assignedCertifier: 1, status: 1 });
RequestSchema.index({ status: 1, 'audit.submittedAt': -1 });
RequestSchema.index({ 'metadata.priority': 1, status: 1 });

// Virtual for request age
RequestSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.audit.submittedAt) / (1000 * 60 * 60));
});

// Virtual for isOverdue
RequestSchema.virtual('isOverdue').get(function() {
  return this.status === 'Pending' && this.ageInHours > this.metadata.estimatedReviewTime;
});

// Pre-save middleware to update lastModified
RequestSchema.pre('save', function(next) {
  this.audit.lastModified = new Date();
  this.audit.version += 1;
  next();
});

// Static method to generate unique request ID
RequestSchema.statics.generateRequestId = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `REQ-${timestamp}-${random}`.toUpperCase();
};

// Static method to get requests by status
RequestSchema.statics.getByStatus = function(status, limit = 50, skip = 0) {
  return this.find({ status })
    .populate('producer', 'name email role')
    .populate('assignedCertifier', 'name email')
    .populate('review.reviewedBy', 'name email')
    .sort({ 'audit.submittedAt': -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get overdue requests
RequestSchema.statics.getOverdueRequests = function() {
  return this.find({
    status: 'Pending',
    $expr: {
      $gt: [
        { $divide: [{ $subtract: [new Date(), '$audit.submittedAt'] }, 1000 * 60 * 60] },
        '$metadata.estimatedReviewTime'
      ]
    }
  })
  .populate('producer', 'name email')
  .populate('assignedCertifier', 'name email')
  .sort({ 'audit.submittedAt': 1 });
};

// Instance method to assign certifier
RequestSchema.methods.assignCertifier = function(certifierId) {
  this.assignedCertifier = certifierId;
  this.status = 'Under Review';
  this.audit.modifiedBy = certifierId;
  return this.save();
};

// Instance method to approve request
RequestSchema.methods.approve = function(certifierId, comments = '') {
  this.status = 'Approved';
  this.review.reviewedBy = certifierId;
  this.review.reviewedAt = new Date();
  this.review.comments = comments;
  this.audit.modifiedBy = certifierId;
  return this.save();
};

// Instance method to reject request
RequestSchema.methods.reject = function(certifierId, reason, details = '') {
  this.status = 'Rejected';
  this.review.reviewedBy = certifierId;
  this.review.reviewedAt = new Date();
  this.review.rejectionReason = reason;
  this.review.rejectionDetails = details;
  this.audit.modifiedBy = certifierId;
  return this.save();
};

// Instance method to convert to credit data
RequestSchema.methods.toCreditData = function() {
  // Generate unique credit ID
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  const creditId = `CR-${timestamp}-${random}`.toUpperCase();
  
  return {
    creditId: creditId,
    producer: this.producer,
    certifier: this.review.reviewedBy,
    productionDate: this.productionDate,
    energyAmountMWh: this.energyAmountMWh,
    energySource: this.energySource,
    facilityName: this.facilityName,
    facilityLocation: this.facilityLocation,
    proofDocumentUrl: this.proofDocumentUrl,
    additionalDocuments: this.additionalDocuments,
    status: 'Certified',
    metadata: {
      originalRequestId: this.requestId,
      certifiedAt: this.review.reviewedAt
    }
  };
};

module.exports = mongoose.model('Request', RequestSchema);
