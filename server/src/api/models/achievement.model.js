const mongoose = require('mongoose');

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
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['Production', 'Efficiency', 'Sustainability', 'Volume', 'Streak', 'Innovation', 'Community'],
    required: true,
    index: true
  },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    required: true,
    index: true
  },
  icon: {
    type: String,
    default: 'trophy'
  },
  color: {
    type: String,
    default: '#FFD700'
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed, // Flexible structure for different achievement types
    required: true
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badge: String,
    benefits: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
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
    required: true,
    index: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    current: {
      type: Number,
      default: 0
    },
    target: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  metadata: {
    triggerEvent: String,
    contextData: mongoose.Schema.Types.Mixed
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to calculate progress percentage
UserAchievementSchema.pre('save', function(next) {
  if (this.progress.target > 0) {
    this.progress.percentage = Math.min(100, (this.progress.current / this.progress.target) * 100);
    this.isCompleted = this.progress.percentage >= 100;
  }
  next();
});

// Virtual for completion status
UserAchievementSchema.virtual('status').get(function() {
  if (this.isCompleted) return 'Completed';
  if (this.progress.percentage > 0) return 'In Progress';
  return 'Not Started';
});

// Instance methods for UserAchievement
UserAchievementSchema.methods.updateProgress = function(newProgress) {
  this.progress.current = newProgress;
  return this.save();
};

UserAchievementSchema.methods.markCompleted = function() {
  this.isCompleted = true;
  this.progress.current = this.progress.target;
  this.progress.percentage = 100;
  this.earnedAt = new Date();
  return this.save();
};

// Static methods for Achievement
AchievementSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

AchievementSchema.statics.findByTier = function(tier) {
  return this.find({ tier, isActive: true });
};

// Static methods for UserAchievement
UserAchievementSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId })
    .populate('achievement')
    .sort({ earnedAt: -1 });
};

UserAchievementSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
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
        totalAchievements: { $sum: 1 },
        completedAchievements: {
          $sum: { $cond: ['$isCompleted', 1, 0] }
        },
        totalPoints: {
          $sum: { $cond: ['$isCompleted', '$achievementData.rewards.points', 0] }
        },
        byCategory: {
          $push: {
            category: '$achievementData.category',
            isCompleted: '$isCompleted',
            points: { $cond: ['$isCompleted', '$achievementData.rewards.points', 0] }
          }
        }
      }
    }
  ]);

  const categoryStats = {};
  if (stats[0]?.byCategory) {
    stats[0].byCategory.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { total: 0, completed: 0, points: 0 };
      }
      categoryStats[item.category].total++;
      if (item.isCompleted) {
        categoryStats[item.category].completed++;
        categoryStats[item.category].points += item.points;
      }
    });
  }

  return {
    totalAchievements: stats[0]?.totalAchievements || 0,
    completedAchievements: stats[0]?.completedAchievements || 0,
    totalPoints: stats[0]?.totalPoints || 0,
    completionRate: stats[0]?.totalAchievements > 0 
      ? ((stats[0].completedAchievements / stats[0].totalAchievements) * 100).toFixed(1)
      : 0,
    byCategory: categoryStats
  };
};

// Indexes
AchievementSchema.index({ category: 1, isActive: 1 });
AchievementSchema.index({ tier: 1, isActive: 1 });

UserAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });
UserAchievementSchema.index({ user: 1, isCompleted: 1 });
UserAchievementSchema.index({ user: 1, earnedAt: -1 });

const Achievement = mongoose.model('Achievement', AchievementSchema);
const UserAchievement = mongoose.model('UserAchievement', UserAchievementSchema);

module.exports = { Achievement, UserAchievement };
