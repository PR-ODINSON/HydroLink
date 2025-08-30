const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Facility name cannot exceed 200 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  energySource: {
    type: String,
    enum: ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Nuclear', 'Other'],
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: [0.1, 'Capacity must be at least 0.1 MW'],
    max: [10000, 'Capacity cannot exceed 10,000 MW']
  },
  efficiency: {
    type: Number,
    min: [0, 'Efficiency cannot be negative'],
    max: [100, 'Efficiency cannot exceed 100%'],
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Offline', 'Decommissioned'],
    default: 'Active'
  },
  commissioning: {
    startDate: Date,
    completionDate: Date,
    certifications: [{
      name: String,
      issuedBy: String,
      issuedDate: Date,
      expiryDate: Date,
      documentUrl: String
    }]
  },
  specifications: {
    technology: String,
    manufacturer: String,
    model: String,
    yearInstalled: Number,
    expectedLifespan: Number
  },
  environmentalData: {
    co2AvoidancePerMWh: {
      type: Number,
      default: 0
    },
    waterUsagePerMWh: {
      type: Number,
      default: 0
    },
    landAreaHectares: {
      type: Number,
      default: 0
    }
  },
  operationalMetrics: {
    totalEnergyProduced: {
      type: Number,
      default: 0
    },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    uptime: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for facility age
FacilitySchema.virtual('ageInYears').get(function() {
  if (this.specifications.yearInstalled) {
    return new Date().getFullYear() - this.specifications.yearInstalled;
  }
  return 0;
});

// Virtual for estimated remaining lifespan
FacilitySchema.virtual('remainingLifespanYears').get(function() {
  if (this.specifications.yearInstalled && this.specifications.expectedLifespan) {
    const age = new Date().getFullYear() - this.specifications.yearInstalled;
    return Math.max(0, this.specifications.expectedLifespan - age);
  }
  return null;
});

// Instance methods
FacilitySchema.methods.updateProduction = function(energyAmount) {
  this.operationalMetrics.totalEnergyProduced += energyAmount;
  return this.save();
};

FacilitySchema.methods.scheduleMaintenance = function(date) {
  this.operationalMetrics.nextMaintenanceDate = date;
  return this.save();
};

FacilitySchema.methods.isOperational = function() {
  return this.status === 'Active';
};

// Static methods
FacilitySchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId }).populate('owner', 'name email');
};

FacilitySchema.statics.findByEnergySource = function(source) {
  return this.find({ energySource: source }).populate('owner', 'name email');
};

FacilitySchema.statics.getFacilityStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$energySource',
        count: { $sum: 1 },
        totalCapacity: { $sum: '$capacity' },
        avgEfficiency: { $avg: '$efficiency' },
        totalProduction: { $sum: '$operationalMetrics.totalEnergyProduced' }
      }
    },
    { $sort: { totalCapacity: -1 } }
  ]);

  const total = await this.countDocuments();
  const totalCapacity = await this.aggregate([
    { $group: { _id: null, total: { $sum: '$capacity' } } }
  ]);

  return {
    total,
    totalCapacityMW: totalCapacity[0]?.total || 0,
    byEnergySource: stats
  };
};

// Indexes
FacilitySchema.index({ owner: 1 });
FacilitySchema.index({ energySource: 1 });
FacilitySchema.index({ status: 1 });
FacilitySchema.index({ 'location.coordinates': '2dsphere' });

const Facility = mongoose.model('Facility', FacilitySchema);
module.exports = Facility;
