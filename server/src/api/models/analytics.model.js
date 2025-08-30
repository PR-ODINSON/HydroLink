const mongoose = require('mongoose');

// Production Analytics Schema
const ProductionAnalyticsSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
    default: 'monthly'
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  metrics: {
    totalProduction: {
      type: Number,
      default: 0,
      min: 0
    },
    energyGenerated: {
      type: Number,
      default: 0,
      min: 0
    },
    creditsIssued: {
      type: Number,
      default: 0,
      min: 0
    },
    efficiency: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    capacity: {
      type: Number,
      default: 0,
      min: 0
    },
    uptime: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    }
  },
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
    carbonIntensity: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  facilityBreakdown: [{
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility'
    },
    production: Number,
    efficiency: Number,
    uptime: Number
  }],
  energySourceBreakdown: [{
    source: {
      type: String,
      enum: ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Nuclear', 'Other']
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    production: Number
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Portfolio Analytics Schema
const PortfolioAnalyticsSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
    default: 'monthly'
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  portfolio: {
    totalValue: {
      type: Number,
      default: 0,
      min: 0
    },
    totalCredits: {
      type: Number,
      default: 0,
      min: 0
    },
    activeCredits: {
      type: Number,
      default: 0,
      min: 0
    },
    retiredCredits: {
      type: Number,
      default: 0,
      min: 0
    },
    averagePurchasePrice: {
      type: Number,
      default: 0,
      min: 0
    },
    currentMarketValue: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  transactions: {
    purchases: {
      count: {
        type: Number,
        default: 0,
        min: 0
      },
      value: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    retirements: {
      count: {
        type: Number,
        default: 0,
        min: 0
      },
      credits: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  impact: {
    co2Offset: {
      type: Number,
      default: 0,
      min: 0
    },
    treesEquivalent: {
      type: Number,
      default: 0,
      min: 0
    },
    carMilesOffset: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  energySourceBreakdown: [{
    source: String,
    credits: Number,
    percentage: Number,
    impact: Number
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Static methods for ProductionAnalytics
ProductionAnalyticsSchema.statics.getEfficiencyStats = async function(ownerId, period = 'monthly', limit = 12) {
  return this.aggregate([
    { 
      $match: { 
        owner: mongoose.Types.ObjectId(ownerId), 
        period: period 
      } 
    },
    { 
      $sort: { date: -1 } 
    },
    { 
      $limit: limit 
    },
    {
      $group: {
        _id: null,
        avgEfficiency: { $avg: '$metrics.efficiency' },
        maxEfficiency: { $max: '$metrics.efficiency' },
        minEfficiency: { $min: '$metrics.efficiency' },
        totalProduction: { $sum: '$metrics.totalProduction' }
      }
    }
  ]);
};

ProductionAnalyticsSchema.statics.getTrendData = async function(ownerId, period = 'monthly', limit = 12) {
  return this.find({
    owner: ownerId,
    period: period
  })
  .sort({ date: -1 })
  .limit(limit)
  .lean();
};

// Static methods for PortfolioAnalytics
PortfolioAnalyticsSchema.statics.getPortfolioGrowth = async function(ownerId, period = 'monthly', limit = 12) {
  return this.find({
    owner: ownerId,
    period: period
  })
  .sort({ date: -1 })
  .limit(limit)
  .select('date portfolio.totalValue portfolio.totalCredits')
  .lean();
};

// Indexes
ProductionAnalyticsSchema.index({ owner: 1, period: 1, date: -1 });
ProductionAnalyticsSchema.index({ date: -1 });

PortfolioAnalyticsSchema.index({ owner: 1, period: 1, date: -1 });
PortfolioAnalyticsSchema.index({ date: -1 });

// Create models
const ProductionAnalytics = mongoose.model('ProductionAnalytics', ProductionAnalyticsSchema);
const PortfolioAnalytics = mongoose.model('PortfolioAnalytics', PortfolioAnalyticsSchema);

module.exports = {
  ProductionAnalytics,
  PortfolioAnalytics
};