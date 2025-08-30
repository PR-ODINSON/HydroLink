const Notification = require('../api/models/notification.model');

async function createNotification({ user, type, message, meta = {} }) {
  try {
    const notification = new Notification({ user, type, message, meta });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('[NotificationService] Failed to create notification:', error);
    return null;
  }
}

// Helper for new request notification to certifier
async function notifyCertifierNewRequest(certifierId, request) {
  return createNotification({
    user: certifierId,
    type: 'request_submitted',
    message: `A new credit request has been submitted by ${request.producer.name || 'a producer'}.`,
    meta: { requestId: request._id }
  });
}

// Helper for approval notification to producer
async function notifyProducerApproved(producerId, credit) {
  return createNotification({
    user: producerId,
    type: 'request_approved',
    message: `Your credit request has been approved and minted.`,
    meta: { creditId: credit._id }
  });
}

// Helper for rejection notification to producer
async function notifyProducerRejected(producerId, reason) {
  return createNotification({
    user: producerId,
    type: 'request_rejected',
    message: `Your credit request was rejected. Reason: ${reason || 'No reason provided.'}`,
    meta: {}
  });
}

module.exports = {
  createNotification,
  notifyCertifierNewRequest,
  notifyProducerApproved,
  notifyProducerRejected
};
