const mongoose = require('mongoose');

const CreditSchema = new mongoose.Schema({
  // Unique credit identifier
  creditId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  // The ID of the token on the blockchain, added after minting
  tokenId: {
    type: String,
    default: null,
    sparse: true,
    unique: true
  },
  // The user who produced the hydrogen
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Producer is required'],
    index: true
  },
  // The user who certified the production
  certifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  // The user who bought/owns the credit
  currentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
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
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Certified', 'Retired', 'Rejected', 'Suspended'],
      message: 'Status must be Pending, Certified, Retired, Rejected, or Suspended'
    },
    default: 'Pending',
    index: true
  },
  certificationDate: {
    type: Date,
    default: null
  },
  certificationNotes: {
    type: String,
    maxlength: [1000, 'Certification notes cannot exceed 1000 characters']
  },
  retirementDate: {
    type: Date,
    default: null
  },
  retirementReason: {
    type: String,
    maxlength: [500, 'Retirement reason cannot exceed 500 characters']
  },
  // Blockchain transaction information
  blockchain: {
    mintTxHash: {
      type: String,
      default: null
    },
    retireTxHash: {
      type: String,
      default: null
    },
    network: {
      type: String,
      default: 'ethereum'
    }
  },
  // Environmental impact data
  environmentalImpact: {
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
  },
  // Pricing information
  pricing: {
    mintPrice: {
      type: Number,
      min: 0
    },
    currentMarketPrice: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  // Quality metrics
  qualityMetrics: {
    purity: {
      type: Number,
      min: 0,
      max: 100
    },
    efficiency: {
      type: Number,
      min: 0,
      max: 100
    },
    sustainability: {
      type: Number,
      min: 0,
      max: 100
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to generate credit ID
CreditSchema.pre('save', function(next) {
  if (!this.creditId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.creditId = `HC-${year}${month}-${random}-${timestamp.toString().slice(-6)}`;
  }
  next();
});

// Virtual for credit age
CreditSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for production age
CreditSchema.virtual('productionAgeInDays').get(function() {
  return Math.floor((new Date() - this.productionDate) / (1000 * 60 * 60 * 24));
});

// Instance methods
CreditSchema.methods.certify = function(certifierId, notes = '') {
  this.status = 'Certified';
  this.certifier = certifierId;
  this.certificationDate = new Date();
  this.certificationNotes = notes;
  return this.save();
};

CreditSchema.methods.retire = function(reason = '') {
  this.status = 'Retired';
  this.retirementDate = new Date();
  this.retirementReason = reason;
  return this.save();
};

CreditSchema.methods.reject = function(reason = '') {
  this.status = 'Rejected';
  this.certificationNotes = reason;
  return this.save();
};

CreditSchema.methods.isRetired = function() {
  return this.status === 'Retired';
};

CreditSchema.methods.isCertified = function() {
  return this.status === 'Certified';
};

CreditSchema.methods.isPending = function() {
  return this.status === 'Pending';
};

// Static methods
CreditSchema.statics.findByProducer = function(producerId) {
  return this.find({ producer: producerId }).populate('producer certifier', 'name email role');
};

CreditSchema.statics.findByCertifier = function(certifierId) {
  return this.find({ certifier: certifierId }).populate('producer certifier', 'name email role');
};

CreditSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('producer certifier', 'name email role');
};

CreditSchema.statics.getCreditStats = async function() {
  const stats = await this.aggregate([
    { $group: { 
      _id: '$status', 
      count: { $sum: 1 },
      totalEnergy: { $sum: '$energyAmountMWh' }
    }},
    { $sort: { _id: 1 } }
  ]);

  const total = await this.countDocuments();
  const totalEnergy = await this.aggregate([
    { $group: { _id: null, total: { $sum: '$energyAmountMWh' } } }
  ]);

  return {
    total,
    totalEnergyMWh: totalEnergy[0]?.total || 0,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalEnergy: stat.totalEnergy
      };
      return acc;
    }, {})
  };
};

// Indexes for better query performance
CreditSchema.index({ creditId: 1 }, { unique: true });
CreditSchema.index({ producer: 1, status: 1 });
CreditSchema.index({ certifier: 1, status: 1 });
CreditSchema.index({ status: 1 });
CreditSchema.index({ productionDate: -1 });
CreditSchema.index({ createdAt: -1 });
CreditSchema.index({ tokenId: 1 }, { sparse: true, unique: true });
CreditSchema.index({ energySource: 1 });

const Credit = mongoose.model('Credit', CreditSchema);
module.exports = Credit;