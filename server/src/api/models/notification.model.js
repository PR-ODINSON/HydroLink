const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // User who receives the notification
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Notification details
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: {
      values: [
        'request_submitted',
        'request_assigned', 
        'request_approved',
        'request_rejected',
        'credit_minted',
        'credit_transferred',
        'credit_retired',
        'system_update',
        'general'
      ],
      message: 'Invalid notification type'
    },
    required: true,
    index: true
  },
  // Status
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  // Priority level
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    index: true
  },
  // Related data
  relatedModel: {
    type: String,
    enum: ['Request', 'Credit', 'User', 'Transaction'],
    default: null
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    index: true
  },
  // Action data (for clickable notifications)
  actionUrl: {
    type: String,
    default: null
  },
  actionText: {
    type: String,
    default: null
  },
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Email notification status
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date,
    default: null
  },
  // Expiration (for temporary notifications)
  expiresAt: {
    type: Date,
    default: null,
    index: { expireAfterSeconds: 0 }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time ago
NotificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
});

// Instance methods
NotificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

NotificationSchema.methods.markEmailSent = function() {
  this.emailSent = true;
  this.emailSentAt = new Date();
  return this.save();
};

// Static methods
NotificationSchema.statics.createForUser = function(userId, notificationData) {
  return this.create({
    user: userId,
    ...notificationData
  });
};

NotificationSchema.statics.findUnreadForUser = function(userId) {
  return this.find({ user: userId, read: false })
    .sort({ createdAt: -1 });
};

NotificationSchema.statics.findForUser = function(userId, limit = 50) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

NotificationSchema.statics.markAllAsReadForUser = function(userId) {
  return this.updateMany(
    { user: userId, read: false },
    { 
      $set: { 
        read: true, 
        readAt: new Date() 
      } 
    }
  );
};

NotificationSchema.statics.getUnreadCountForUser = function(userId) {
  return this.countDocuments({ user: userId, read: false });
};

// Notification factory methods
NotificationSchema.statics.createRequestSubmittedNotification = function(certifierIds, requestData) {
  const notifications = certifierIds.map(certifierId => ({
    user: certifierId,
    title: 'New Credit Request Submitted',
    message: `A new hydrogen credit request has been submitted by ${requestData.producerName} for ${requestData.energyAmountMWh} MWh from ${requestData.facilityName}.`,
    type: 'request_submitted',
    priority: 'normal',
    relatedModel: 'Request',
    relatedId: requestData.requestId,
    actionUrl: '/dashboard',
    actionText: 'Review Request',
    metadata: {
      producerName: requestData.producerName,
      facilityName: requestData.facilityName,
      energyAmount: requestData.energyAmountMWh,
      energySource: requestData.energySource
    }
  }));
  
  return this.insertMany(notifications);
};

NotificationSchema.statics.createRequestApprovedNotification = function(producerId, requestData, certifierName, tokenId) {
  return this.create({
    user: producerId,
    title: 'Credit Request Approved! 🎉',
    message: `Congratulations! Your hydrogen credit request for ${requestData.energyAmountMWh} MWh has been approved by ${certifierName}. Your credit has been minted on the blockchain with Token ID: ${tokenId}.`,
    type: 'request_approved',
    priority: 'high',
    relatedModel: 'Credit',
    relatedId: requestData.creditId,
    actionUrl: '/dashboard',
    actionText: 'View Credit',
    metadata: {
      certifierName,
      tokenId,
      energyAmount: requestData.energyAmountMWh,
      facilityName: requestData.facilityName,
      approvedAt: new Date()
    }
  });
};

NotificationSchema.statics.createRequestRejectedNotification = function(producerId, requestData, certifierName, reason) {
  return this.create({
    user: producerId,
    title: 'Credit Request Rejected',
    message: `Your hydrogen credit request for ${requestData.energyAmountMWh} MWh from ${requestData.facilityName} has been rejected by ${certifierName}. Reason: ${reason}`,
    type: 'request_rejected',
    priority: 'high',
    relatedModel: 'Request',
    relatedId: requestData.requestId,
    actionUrl: '/dashboard',
    actionText: 'Submit New Request',
    metadata: {
      certifierName,
      rejectionReason: reason,
      energyAmount: requestData.energyAmountMWh,
      facilityName: requestData.facilityName,
      rejectedAt: new Date()
    }
  });
};

NotificationSchema.statics.createCreditMintedNotification = function(producerId, creditData, tokenId) {
  return this.create({
    user: producerId,
    title: 'Credit Successfully Minted! 🪙',
    message: `Your hydrogen credit has been successfully minted on the blockchain! Token ID: ${tokenId}. You can now trade or retire this credit.`,
    type: 'credit_minted',
    priority: 'high',
    relatedModel: 'Credit',
    relatedId: creditData.creditId,
    actionUrl: '/credits',
    actionText: 'View Credit',
    metadata: {
      tokenId,
      energyAmount: creditData.energyAmountMWh,
      facilityName: creditData.facilityName,
      mintedAt: new Date()
    }
  });
};

// Indexes for better query performance
NotificationSchema.index({ user: 1, read: 1 });
NotificationSchema.index({ user: 1, type: 1 });
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, priority: 1, read: 1 });
NotificationSchema.index({ relatedModel: 1, relatedId: 1 });
NotificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;