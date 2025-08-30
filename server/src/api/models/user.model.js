const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['Producer', 'Certifier', 'Buyer'],
    required: true,
  },
  walletAddress: {
    type: String,
    default: null,
  },
  profile: {
    company: String,
    description: String,
    website: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    avatar: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      weekly_summary: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      publicProfile: {
        type: Boolean,
        default: false
      },
      showInLeaderboard: {
        type: Boolean,
        default: true
      }
    },
    dashboard: {
      defaultView: {
        type: String,
        enum: ['overview', 'analytics', 'transactions'],
        default: 'overview'
      },
      chartPreferences: {
        type: String,
        enum: ['line', 'bar', 'area'],
        default: 'area'
      }
    }
  },
  stats: {
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    points: {
      type: Number,
      default: 0,
      min: 0
    },
    streak: {
      current: {
        type: Number,
        default: 0,
        min: 0
      },
      longest: {
        type: Number,
        default: 0,
        min: 0
      },
      lastActivity: Date
    },
    achievements: {
      total: {
        type: Number,
        default: 0,
        min: 0
      },
      completed: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  roleSpecific: {
    // Producer specific fields
    producer: {
      facilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
      }],
      totalProduction: {
        type: Number,
        default: 0,
        min: 0
      },
      certificationLevel: {
        type: String,
        enum: ['Basic', 'Standard', 'Premium', 'Elite'],
        default: 'Basic'
      }
    },
    // Certifier specific fields
    certifier: {
      verificationCount: {
        type: Number,
        default: 0,
        min: 0
      },
      approvalRate: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
      },
      specializations: [{
        type: String,
        enum: ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Nuclear']
      }],
      certificationLevel: {
        type: String,
        enum: ['Junior', 'Senior', 'Expert', 'Master'],
        default: 'Junior'
      }
    },
    // Buyer specific fields
    buyer: {
      totalPurchased: {
        type: Number,
        default: 0,
        min: 0
      },
      totalRetired: {
        type: Number,
        default: 0,
        min: 0
      },
      portfolioValue: {
        type: Number,
        default: 0,
        min: 0
      },
      sustainabilityGoals: {
        annual_offset_target: {
          type: Number,
          default: 0,
          min: 0
        },
        current_progress: {
          type: Number,
          default: 0,
          min: 0
        }
      }
    }
  },
  security: {
    lastLogin: Date,
    lastPasswordChange: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    loginAttempts: {
      type: Number,
      default: 0,
      min: 0
    },
    lockUntil: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;