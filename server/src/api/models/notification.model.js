const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
<<<<<<< HEAD
  // The user who will receive this notification
  recipient: {
=======
  user: {
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
<<<<<<< HEAD
  // The user who triggered this notification (optional)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Notification type
  type: {
    type: String,
    enum: [
      'credit_request_submitted',
      'credit_request_assigned',
      'credit_request_approved',
      'credit_request_rejected',
      'credit_minted',
      'credit_purchased',
      'credit_retired',
      'system_announcement',
      'reminder',
      'achievement_unlocked'
    ],
    required: true,
    index: true
  },
  // Notification title
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  // Notification message
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  // Rich content for detailed notifications
  content: {
    type: String,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  // Related entities
  relatedEntity: {
    type: {
      type: String,
      enum: ['Request', 'Credit', 'Transaction', 'User', 'Achievement'],
      default: null
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  // Notification status
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Archived'],
    default: 'Unread',
    index: true
  },
  // Delivery channels
  delivery: {
    inApp: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: {
        type: Date,
        default: null
      }
    },
    email: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: {
        type: Date,
        default: null
      },
      subject: {
        type: String,
        maxlength: [200, 'Email subject cannot exceed 200 characters']
      },
      template: {
        type: String,
        enum: ['credit_request', 'credit_approved', 'credit_rejected', 'credit_minted', 'general'],
        default: 'general'
      }
    },
    push: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: {
        type: Date,
        default: null
      }
    }
  },
  // Priority level
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal',
    index: true
  },
  // Action buttons for the notification
  actions: [{
    label: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    url: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^\/.+/.test(v);
        },
        message: 'Action URL must be a relative path'
      }
    },
    style: {
      type: String,
      enum: ['primary', 'secondary', 'success', 'danger', 'warning'],
      default: 'primary'
    }
  }],
  // Metadata
  metadata: {
    category: {
      type: String,
      enum: ['Credit', 'Transaction', 'System', 'Achievement', 'Reminder'],
      default: 'System'
    },
    tags: [String],
    expiresAt: {
      type: Date,
      default: null
    },
    autoArchive: {
      type: Boolean,
      default: false
    }
  },
  // Read tracking
  readAt: {
    type: Date,
    default: null
  },
  // Archive tracking
  archivedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
NotificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ priority: 1, status: 1 });
NotificationSchema.index({ 'metadata.expiresAt': 1 }, { expireAfterSeconds: 0 });

// Virtual for age
NotificationSchema.virtual('ageInMinutes').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60));
});

// Virtual for isExpired
NotificationSchema.virtual('isExpired').get(function() {
  return this.metadata.expiresAt && new Date() > this.metadata.expiresAt;
});

// Pre-save middleware to set email subject if not provided
NotificationSchema.pre('save', function(next) {
  if (this.delivery.email.sent === false && !this.delivery.email.subject) {
    this.delivery.email.subject = this.title;
  }
  next();
});

// Static method to create notification
NotificationSchema.statics.createNotification = function(data) {
  return new this({
    recipient: data.recipient,
    sender: data.sender || null,
    type: data.type,
    title: data.title,
    message: data.message,
    content: data.content || null,
    relatedEntity: data.relatedEntity || null,
    priority: data.priority || 'Normal',
    actions: data.actions || [],
    metadata: {
      category: data.category || 'System',
      tags: data.tags || [],
      expiresAt: data.expiresAt || null,
      autoArchive: data.autoArchive || false
    },
    delivery: {
      email: {
        template: data.emailTemplate || 'general'
      }
    }
  });
};

// Static method to get unread notifications for a user
NotificationSchema.statics.getUnreadForUser = function(userId, limit = 20) {
  return this.find({
    recipient: userId,
    status: 'Unread',
    $or: [
      { 'metadata.expiresAt': null },
      { 'metadata.expiresAt': { $gt: new Date() } }
    ]
  })
  .populate('sender', 'name email')
  .populate('relatedEntity.id')
  .sort({ priority: -1, createdAt: -1 })
  .limit(limit);
};

// Static method to mark notifications as read
NotificationSchema.statics.markAsRead = function(notificationIds, userId) {
  return this.updateMany(
    {
      _id: { $in: notificationIds },
      recipient: userId,
      status: 'Unread'
    },
    {
      $set: {
        status: 'Read',
        readAt: new Date()
      }
    }
  );
};

// Static method to archive old notifications
NotificationSchema.statics.archiveOldNotifications = function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.updateMany(
    {
      status: 'Read',
      readAt: { $lt: cutoffDate }
    },
    {
      $set: {
        status: 'Archived',
        archivedAt: new Date()
      }
    }
  );
};

// Instance method to mark as read
NotificationSchema.methods.markAsRead = function() {
  this.status = 'Read';
  this.readAt = new Date();
  return this.save();
};

// Instance method to archive
NotificationSchema.methods.archive = function() {
  this.status = 'Archived';
  this.archivedAt = new Date();
  return this.save();
};

// Instance method to update delivery status
NotificationSchema.methods.updateDeliveryStatus = function(channel, status) {
  if (this.delivery[channel]) {
    this.delivery[channel].sent = status;
    this.delivery[channel].sentAt = status ? new Date() : null;
  }
  return this.save();
};

module.exports = mongoose.model('Notification', NotificationSchema);
=======
  type: {
    type: String,
    enum: ['request_submitted', 'request_approved', 'request_rejected', 'general'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  meta: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c
