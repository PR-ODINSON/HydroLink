const mongoose = require('mongoose');

// Achievement Definition Schema
const AchievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Production', 'Certification', 'Trading', 'Environmental', 'Community', 'Special'],
    required: true
  },
  type: {
    type: String,
    enum: ['milestone', 'streak', 'cumulative', 'percentage', 'first_time', 'special'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  requirements: {
    // For milestone achievements
    threshold: {
      type: Number,
      min: 0
    },
    metric: {
      type: String,
      enum: ['credits_produced', 'credits_certified', 'credits_purchased', 'credits_retired', 
             'energy_generated', 'co2_avoided', 'facilities_owned', 'consecutive_days', 
             'transaction_volume', 'user_rating']
    },
    // For percentage achievements
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    // For time-based achievements
    timeframe: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'all_time']
    },
    // Additional conditions
    conditions: {
      energy_source: [String],
      role: {
        type: String,
        enum: ['Producer', 'Certifier', 'Buyer']
      },
      minimum_efficiency: Number,
      consecutive_required: Boolean
    }
  },
  rewards: {
    points: {
      type: Number,
      default: 0,
      min: 0
    },
    badge: {
      icon: String,
      color: String,
      design: String
    },
    title: String,
    benefits: [String]
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'role_specific'],
    default: 'public'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// User Achievement Schema (Junction table)
const UserAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    current: {
      type: Number,
      default: 0,
      min: 0
    },
    target: {
      type: Number,
      required: true,
      min: 1
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'expired'],
    default: 'in_progress'
  },
  metadata: {
    // Store additional context about achievement
    triggerEvent: String,
    relatedEntityId: String,
    milestone_values: [Number],
    streak_dates: [Date]
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for completion status
UserAchievementSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

// Pre-save middleware to calculate percentage
UserAchievementSchema.pre('save', function(next) {
  if (this.progress.target > 0) {
    this.progress.percentage = Math.min(100, (this.progress.current / this.progress.target) * 100);
    
    // Auto-complete if target reached
    if (this.progress.current >= this.progress.target && this.status !== 'completed') {
      this.status = 'completed';
      this.unlockedAt = new Date();
    }
  }
  next();
});

// Static methods for UserAchievement
UserAchievementSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId })
    .populate('achievement')
    .sort({ unlockedAt: -1 });
};

UserAchievementSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalPoints: { 
          $sum: {
            $cond: [
              { $eq: ['$status', 'completed'] },
              '$achievement.rewards.points',
              0
            ]
          }
        }
      }
    }
  ]);

  const levelInfo = await this.calculateUserLevel(userId);
  
  return {
    achievements: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {}),
    totalPoints: stats.reduce((sum, stat) => sum + (stat.totalPoints || 0), 0),
    level: levelInfo.level,
    nextLevelProgress: levelInfo.progress
  };
};

UserAchievementSchema.statics.calculateUserLevel = async function(userId) {
  const totalPoints = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $lookup: {
        from: 'achievements',
        localField: 'achievement',
        foreignField: '_id',
        as: 'achievementData'
      }
    },
    { $unwind: '$achievementData' },
    {
      $group: {
        _id: null,
        total: { $sum: '$achievementData.rewards.points' }
      }
    }
  ]);

  const points = totalPoints[0]?.total || 0;
  
  // Level calculation (exponential curve)
  const level = Math.floor(Math.sqrt(points / 100)) + 1;
  const currentLevelThreshold = Math.pow(level - 1, 2) * 100;
  const nextLevelThreshold = Math.pow(level, 2) * 100;
  const progress = ((points - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;

  return {
    level,
    points,
    progress: Math.min(100, Math.max(0, progress)),
    nextLevelThreshold
  };
};

UserAchievementSchema.statics.checkAndUnlockAchievements = async function(userId, metrics) {
  const user = await mongoose.model('User').findById(userId);
  if (!user) return [];

  const availableAchievements = await mongoose.model('Achievement').find({
    isActive: true,
    $or: [
      { 'requirements.conditions.role': user.role },
      { 'requirements.conditions.role': { $exists: false } }
    ]
  });

  const unlockedAchievements = [];

  for (const achievement of availableAchievements) {
    const existingProgress = await this.findOne({
      user: userId,
      achievement: achievement._id
    });

    // Skip if already completed
    if (existingProgress && existingProgress.status === 'completed') {
      continue;
    }

    const meetsRequirements = await this.evaluateRequirements(achievement, metrics, user);
    
    if (meetsRequirements.qualified) {
      if (existingProgress) {
        // Update existing progress
        existingProgress.progress.current = meetsRequirements.currentValue;
        existingProgress.progress.target = meetsRequirements.targetValue;
        await existingProgress.save();
        
        if (existingProgress.status === 'completed') {
          unlockedAchievements.push(existingProgress);
        }
      } else {
        // Create new achievement progress
        const newAchievement = new this({
          user: userId,
          achievement: achievement._id,
          progress: {
            current: meetsRequirements.currentValue,
            target: meetsRequirements.targetValue
          }
        });
        await newAchievement.save();
        
        if (newAchievement.status === 'completed') {
          unlockedAchievements.push(newAchievement);
        }
      }
    }
  }

  return unlockedAchievements;
};

UserAchievementSchema.statics.evaluateRequirements = async function(achievement, metrics, user) {
  const req = achievement.requirements;
  let currentValue = 0;
  let targetValue = req.threshold || 1;
  let qualified = false;

  switch (req.metric) {
    case 'credits_produced':
      currentValue = metrics.creditsProduced || 0;
      qualified = currentValue >= targetValue;
      break;
    case 'credits_certified':
      currentValue = metrics.creditsCertified || 0;
      qualified = currentValue >= targetValue;
      break;
    case 'credits_purchased':
      currentValue = metrics.creditsPurchased || 0;
      qualified = currentValue >= targetValue;
      break;
    case 'credits_retired':
      currentValue = metrics.creditsRetired || 0;
      qualified = currentValue >= targetValue;
      break;
    case 'energy_generated':
      currentValue = metrics.energyGenerated || 0;
      qualified = currentValue >= targetValue;
      break;
    case 'co2_avoided':
      currentValue = metrics.co2Avoided || 0;
      qualified = currentValue >= targetValue;
      break;
    default:
      qualified = false;
  }

  return {
    qualified,
    currentValue,
    targetValue
  };
};

// Indexes
AchievementSchema.index({ category: 1, type: 1 });
AchievementSchema.index({ isActive: 1 });
AchievementSchema.index({ rarity: 1 });

UserAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });
UserAchievementSchema.index({ user: 1, status: 1 });
UserAchievementSchema.index({ achievement: 1, status: 1 });

// Create models
const Achievement = mongoose.model('Achievement', AchievementSchema);
const UserAchievement = mongoose.model('UserAchievement', UserAchievementSchema);

module.exports = {
  Achievement,
  UserAchievement
};