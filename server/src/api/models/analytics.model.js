const mongoose = require('mongoose');

// Production Analytics Schema
const ProductionAnalyticsSchema = new mongoose.Schema({
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
    index: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    required: true,
    index: true
  },
  metrics: {
    energyProduced: {
      type: Number,
      default: 0,
      min: 0
    },
    capacity: {
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
    uptime: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    co2Avoided: {
      type: Number,
      default: 0,
      min: 0
    },
    waterUsed: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  costs: {
    operational: {
      type: Number,
      default: 0,
      min: 0
    },
    maintenance: {
      type: Number,
      default: 0,
      min: 0
    },
    fuel: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  weather: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    solarIrradiance: Number,
    precipitation: Number
  },
  incidents: {
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    downtime: {
      type: Number,
      default: 0,
      min: 0
    },
    causes: [String]
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Market Analytics Schema
const MarketAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    required: true,
    index: true
  },
  credits: {
    totalIssued: {
      type: Number,
      default: 0,
      min: 0
    },
    totalRetired: {
      type: Number,
      default: 0,
      min: 0
    },
    totalTraded: {
      type: Number,
      default: 0,
      min: 0
    },
    activeCredits: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  pricing: {
    averagePrice: {
      type: Number,
      default: 0,
      min: 0
    },
    minPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    maxPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    tradingVolume: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  participants: {
    activeProducers: {
      type: Number,
      default: 0,
      min: 0
    },
    activeBuyers: {
      type: Number,
      default: 0,
      min: 0
    },
    activeCertifiers: {
      type: Number,
      default: 0,
      min: 0
    },
    newRegistrations: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  byEnergySource: [{
    source: {
      type: String,
      enum: ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Nuclear', 'Other']
    },
    creditsIssued: {
      type: Number,
      default: 0
    },
    averagePrice: {
      type: Number,
      default: 0
    },
    tradingVolume: {
      type: Number,
      default: 0
    }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// User Portfolio Analytics Schema
const PortfolioAnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
    index: true
  },
  holdings: {
    totalCredits: {
      type: Number,
      default: 0,
      min: 0
    },
    totalValue: {
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
    },
    unrealizedGainLoss: {
      type: Number,
      default: 0
    }
  },
  transactions: {
    purchases: {
      count: {
        type: Number,
        default: 0,
        min: 0
      },
      totalValue: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    sales: {
      count: {
        type: Number,
        default: 0,
        min: 0
      },
      totalValue: {
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
      totalCredits: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  sustainability: {
    co2OffsetTotal: {
      type: Number,
      default: 0,
      min: 0
    },
    co2OffsetThisPeriod: {
      type: Number,
      default: 0,
      min: 0
    },
    sustainabilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  byEnergySource: [{
    source: String,
    credits: Number,
    value: Number,
    percentage: Number
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for portfolio performance
PortfolioAnalyticsSchema.virtual('performance').get(function() {
  if (this.holdings.totalValue > 0) {
    return ((this.holdings.currentMarketValue - this.holdings.totalValue) / this.holdings.totalValue) * 100;
  }
  return 0;
});

// Static methods for ProductionAnalytics
ProductionAnalyticsSchema.statics.getProductionTrends = async function(facilityId, startDate, endDate, period = 'daily') {
  return this.find({
    facility: facilityId,
    date: { $gte: startDate, $lte: endDate },
    period: period
  }).sort({ date: 1 });
};

ProductionAnalyticsSchema.statics.getEfficiencyStats = async function(ownerId, period = 'monthly') {
  return this.aggregate([
    { $match: { owner: mongoose.Types.ObjectId(ownerId), period: period } },
    {
      $group: {
        _id: null,
        avgEfficiency: { $avg: '$metrics.efficiency' },
        maxEfficiency: { $max: '$metrics.efficiency' },
        minEfficiency: { $min: '$metrics.efficiency' },
        totalProduction: { $sum: '$metrics.energyProduced' },
        avgUptime: { $avg: '$metrics.uptime' }
      }
    }
  ]);
};

// Static methods for MarketAnalytics
MarketAnalyticsSchema.statics.getPricingTrends = async function(startDate, endDate, period = 'daily') {
  return this.find({
    date: { $gte: startDate, $lte: endDate },
    period: period
  }).sort({ date: 1 });
};

MarketAnalyticsSchema.statics.getMarketOverview = async function() {
  const latest = await this.findOne().sort({ date: -1 });
  return latest || {};
};

// Static methods for PortfolioAnalytics
PortfolioAnalyticsSchema.statics.getUserPortfolioHistory = async function(userId, period = 'monthly', limit = 12) {
  return this.find({
    user: userId,
    period: period
  }).sort({ date: -1 }).limit(limit);
};

PortfolioAnalyticsSchema.statics.getPortfolioComparison = async function(userIds, period = 'monthly') {
  return this.aggregate([
    {
      $match: {
        user: { $in: userIds.map(id => mongoose.Types.ObjectId(id)) },
        period: period
      }
    },
    {
      $group: {
        _id: '$user',
        avgHoldings: { $avg: '$holdings.totalCredits' },
        totalValue: { $sum: '$holdings.totalValue' },
        totalCO2Offset: { $sum: '$sustainability.co2OffsetTotal' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    }
  ]);
};

// Indexes
ProductionAnalyticsSchema.index({ facility: 1, date: -1 });
ProductionAnalyticsSchema.index({ owner: 1, period: 1, date: -1 });

MarketAnalyticsSchema.index({ date: -1, period: 1 });
MarketAnalyticsSchema.index({ period: 1, date: -1 });

PortfolioAnalyticsSchema.index({ user: 1, date: -1 });
PortfolioAnalyticsSchema.index({ user: 1, period: 1, date: -1 });

const ProductionAnalytics = mongoose.model('ProductionAnalytics', ProductionAnalyticsSchema);
const MarketAnalytics = mongoose.model('MarketAnalytics', MarketAnalyticsSchema);
const PortfolioAnalytics = mongoose.model('PortfolioAnalytics', PortfolioAnalyticsSchema);

module.exports = {
  ProductionAnalytics,
  MarketAnalytics,
  PortfolioAnalytics
};
