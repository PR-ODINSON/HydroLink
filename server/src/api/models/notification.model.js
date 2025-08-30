const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
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
