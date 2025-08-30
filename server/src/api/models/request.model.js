const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  // Unique request identifier
  requestId: {
    type: String,
    unique: true,
    index: true
  },
  // The producer who submitted the request
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Producer is required'],
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
  proofDocumentUrl: {
    type: String,
    required: [true, 'Proof document URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v) || /^ipfs:\/\/.+/.test(v);
      },
      message: 'Please enter a valid HTTP or IPFS URL'
    }
  },
  additionalDocuments: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['Certificate', 'Invoice', 'Report', 'Image', 'Other']
    }
  }],
  // Request status
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Under Review', 'Approved', 'Rejected'],
      message: 'Status must be Pending, Under Review, Approved, or Rejected'
    },
    default: 'Pending',
    index: true
  },
  // Certification workflow
  assignedCertifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewStartedAt: {
    type: Date,
    default: null
  },
  reviewCompletedAt: {
    type: Date,
    default: null
  },
  // Approval/Rejection details
  certifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    maxlength: [1000, 'Rejection reason cannot exceed 1000 characters']
  },
  certifierComments: {
    type: String,
    maxlength: [1000, 'Certifier comments cannot exceed 1000 characters']
  },
  // Audit trail
  audit: {
    submittedAt: {
      type: Date,
      default: Date.now
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  // Environmental impact data (estimated)
  estimatedEnvironmentalImpact: {
    co2Avoided: {
      type: Number,
      default: 0,
      min: 0
    },
    waterUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    landUsed: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to generate request ID
RequestSchema.pre('save', function(next) {
  if (!this.requestId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.requestId = `REQ-${year}${month}-${random}-${timestamp.toString().slice(-6)}`;
  }
  
  // Update audit trail
  this.audit.lastModifiedAt = new Date();
  
  next();
});

// Virtual for request age
RequestSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for production age
RequestSchema.virtual('productionAgeInDays').get(function() {
  return Math.floor((new Date() - this.productionDate) / (1000 * 60 * 60 * 24));
});

// Instance methods
RequestSchema.methods.assignToCertifier = function(certifierId) {
  this.assignedCertifier = certifierId;
  this.status = 'Under Review';
  this.reviewStartedAt = new Date();
  this.audit.modifiedBy = certifierId;
  return this.save();
};

RequestSchema.methods.approve = function(certifierId, comments = '') {
  this.status = 'Approved';
  this.certifier = certifierId;
  this.approvedAt = new Date();
  this.reviewCompletedAt = new Date();
  this.certifierComments = comments;
  this.audit.modifiedBy = certifierId;
  return this.save();
};

RequestSchema.methods.reject = function(certifierId, reason, comments = '') {
  this.status = 'Rejected';
  this.certifier = certifierId;
  this.rejectedAt = new Date();
  this.reviewCompletedAt = new Date();
  this.rejectionReason = reason;
  this.certifierComments = comments;
  this.audit.modifiedBy = certifierId;
  return this.save();
};

// Convert request to credit data format
RequestSchema.methods.toCreditData = function() {
  return {
    producer: this.producer,
    productionDate: this.productionDate,
    energyAmountMWh: this.energyAmountMWh,
    energySource: this.energySource,
    facilityName: this.facilityName,
    facilityLocation: this.facilityLocation,
    proofDocumentUrl: this.proofDocumentUrl,
    additionalDocuments: this.additionalDocuments,
    status: 'Certified',
    certifier: this.certifier,
    certificationDate: new Date(),
    certificationNotes: this.certifierComments,
    environmentalImpact: this.estimatedEnvironmentalImpact,
    // Reference to original request
    originalRequest: this._id
  };
};

// Static methods
RequestSchema.statics.findByProducer = function(producerId) {
  return this.find({ producer: producerId })
    .populate('producer assignedCertifier certifier', 'name email role')
    .sort({ createdAt: -1 });
};

RequestSchema.statics.findPendingRequests = function() {
  return this.find({ status: { $in: ['Pending', 'Under Review'] } })
    .populate('producer assignedCertifier', 'name email role walletAddress')
    .sort({ 'audit.submittedAt': 1 });
};

RequestSchema.statics.findByStatus = function(status) {
  return this.find({ status })
    .populate('producer assignedCertifier certifier', 'name email role')
    .sort({ createdAt: -1 });
};

// Indexes for better query performance (removing duplicates)
RequestSchema.index({ producer: 1, status: 1 });
RequestSchema.index({ assignedCertifier: 1, status: 1 });
RequestSchema.index({ 'audit.submittedAt': -1 });
RequestSchema.index({ createdAt: -1 });

const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;