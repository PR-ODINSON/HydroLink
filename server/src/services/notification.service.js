const Notification = require('../api/models/notification.model');
const User = require('../api/models/user.model');

// Make nodemailer optional for development
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.warn('Nodemailer not available, email notifications will be logged to console');
  nodemailer = null;
}

class NotificationService {
  constructor() {
    this.emailTransporter = this.createEmailTransporter();
  }

  createEmailTransporter() {
    // Configure email transporter based on environment
    if (process.env.NODE_ENV === 'production' && nodemailer) {
      return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      // For development, use console logging
      return {
        sendMail: (options) => {
          console.log('📧 Email would be sent:', {
            to: options.to,
            subject: options.subject,
            text: options.text
          });
          return Promise.resolve({ messageId: 'test-message-id' });
        }
      };
    }
  }

  // Create and send notification
  async createNotification(data) {
    try {
      const notification = Notification.createNotification(data);
      await notification.save();

      // Send in-app notification immediately
      await this.sendInAppNotification(notification);

      // Send email notification if user has email notifications enabled
      const user = await User.findById(data.recipient);
      if (user && user.preferences.notifications.email) {
        await this.sendEmailNotification(notification, user);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send in-app notification
  async sendInAppNotification(notification) {
    try {
      notification.delivery.inApp.sent = true;
      notification.delivery.inApp.sentAt = new Date();
      await notification.save();
      
      // Here you could integrate with WebSocket or Server-Sent Events
      // to push real-time notifications to the frontend
      console.log(`📱 In-app notification sent to user ${notification.recipient}: ${notification.title}`);
      
      return true;
    } catch (error) {
      console.error('Error sending in-app notification:', error);
      return false;
    }
  }

  // Send email notification
  async sendEmailNotification(notification, user) {
    try {
      const emailContent = this.generateEmailContent(notification, user);
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@hydrolink.com',
        to: user.email,
        subject: notification.delivery.email.subject || notification.title,
        html: emailContent.html,
        text: emailContent.text
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      
      notification.delivery.email.sent = true;
      notification.delivery.email.sentAt = new Date();
      await notification.save();

      console.log(`📧 Email notification sent to ${user.email}: ${notification.title}`);
      return result;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  // Generate email content based on notification type
  generateEmailContent(notification, user) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    switch (notification.type) {
      case 'credit_request_submitted':
        return {
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #059669;">New Credit Request Submitted</h2>
              <p>Hello ${user.name},</p>
              <p>Your credit request has been successfully submitted and is now under review.</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Request Details:</h3>
                <p><strong>Message:</strong> ${notification.message}</p>
                ${notification.content ? `<p><strong>Additional Info:</strong> ${notification.content}</p>` : ''}
              </div>
              <p>You will be notified once a certifier reviews your request.</p>
              <a href="${baseUrl}/producer/requests" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Request Status</a>
            </div>
          `,
          text: `New Credit Request Submitted\n\nHello ${user.name},\n\nYour credit request has been successfully submitted and is now under review.\n\nMessage: ${notification.message}\n\nYou will be notified once a certifier reviews your request.\n\nView Request Status: ${baseUrl}/producer/requests`
        };

      case 'credit_request_approved':
        return {
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #059669;">🎉 Credit Request Approved!</h2>
              <p>Hello ${user.name},</p>
              <p>Great news! Your credit request has been approved and your green credits have been minted on the blockchain.</p>
              <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                <h3>Approval Details:</h3>
                <p><strong>Message:</strong> ${notification.message}</p>
                ${notification.content ? `<p><strong>Additional Info:</strong> ${notification.content}</p>` : ''}
              </div>
              <p>Your credits are now available in your wallet and can be traded on the marketplace.</p>
              <a href="${baseUrl}/producer/credits" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Your Credits</a>
            </div>
          `,
          text: `Credit Request Approved!\n\nHello ${user.name},\n\nGreat news! Your credit request has been approved and your green credits have been minted on the blockchain.\n\nMessage: ${notification.message}\n\nYour credits are now available in your wallet and can be traded on the marketplace.\n\nView Your Credits: ${baseUrl}/producer/credits`
        };

      case 'credit_request_rejected':
        return {
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Credit Request Rejected</h2>
              <p>Hello ${user.name},</p>
              <p>Unfortunately, your credit request has been rejected. Please review the feedback below and resubmit if needed.</p>
              <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3>Rejection Details:</h3>
                <p><strong>Message:</strong> ${notification.message}</p>
                ${notification.content ? `<p><strong>Feedback:</strong> ${notification.content}</p>` : ''}
              </div>
              <p>You can submit a new request with the necessary corrections.</p>
              <a href="${baseUrl}/producer/requests/new" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Submit New Request</a>
            </div>
          `,
          text: `Credit Request Rejected\n\nHello ${user.name},\n\nUnfortunately, your credit request has been rejected. Please review the feedback below and resubmit if needed.\n\nMessage: ${notification.message}\n\nYou can submit a new request with the necessary corrections.\n\nSubmit New Request: ${baseUrl}/producer/requests/new`
        };

      case 'credit_request_assigned':
        return {
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Credit Request Assigned</h2>
              <p>Hello ${user.name},</p>
              <p>A new credit request has been assigned to you for review.</p>
              <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h3>Request Details:</h3>
                <p><strong>Message:</strong> ${notification.message}</p>
                ${notification.content ? `<p><strong>Additional Info:</strong> ${notification.content}</p>` : ''}
              </div>
              <p>Please review the request and provide your decision.</p>
              <a href="${baseUrl}/certifier/requests" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Review Request</a>
            </div>
          `,
          text: `New Credit Request Assigned\n\nHello ${user.name},\n\nA new credit request has been assigned to you for review.\n\nMessage: ${notification.message}\n\nPlease review the request and provide your decision.\n\nReview Request: ${baseUrl}/certifier/requests`
        };

      default:
        return {
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #374151;">${notification.title}</h2>
              <p>Hello ${user.name},</p>
              <p>${notification.message}</p>
              ${notification.content ? `<p>${notification.content}</p>` : ''}
              <a href="${baseUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit HydroLink</a>
            </div>
          `,
          text: `${notification.title}\n\nHello ${user.name},\n\n${notification.message}\n\n${notification.content || ''}\n\nVisit HydroLink: ${baseUrl}`
        };
    }
  }

  // Notification factory methods for common scenarios
  async notifyCreditRequestSubmitted(producerId, requestId, requestData) {
    return this.createNotification({
      recipient: producerId,
      type: 'credit_request_submitted',
      title: 'Credit Request Submitted',
      message: `Your credit request for ${requestData.energyAmountMWh} MWh of ${requestData.energySource} energy has been submitted successfully.`,
      content: `Facility: ${requestData.facilityName}\nLocation: ${requestData.facilityLocation}\nProduction Date: ${new Date(requestData.productionDate).toLocaleDateString()}`,
      relatedEntity: {
        type: 'Request',
        id: requestId
      },
      priority: 'Normal',
      category: 'Credit',
      actions: [
        {
          label: 'View Request',
          action: 'view_request',
          url: '/producer/requests',
          style: 'primary'
        }
      ]
    });
  }

  async notifyCertifierNewRequest(certifierId, requestId, requestData, producerName) {
    return this.createNotification({
      recipient: certifierId,
      type: 'credit_request_assigned',
      title: 'New Credit Request Assigned',
      message: `A new credit request from ${producerName} requires your review.`,
      content: `Energy: ${requestData.energyAmountMWh} MWh of ${requestData.energySource}\nFacility: ${requestData.facilityName}\nLocation: ${requestData.facilityLocation}`,
      relatedEntity: {
        type: 'Request',
        id: requestId
      },
      priority: 'High',
      category: 'Credit',
      actions: [
        {
          label: 'Review Request',
          action: 'review_request',
          url: '/certifier/requests',
          style: 'primary'
        },
        {
          label: 'Approve',
          action: 'approve_request',
          url: `/certifier/requests/${requestId}/approve`,
          style: 'success'
        },
        {
          label: 'Reject',
          action: 'reject_request',
          url: `/certifier/requests/${requestId}/reject`,
          style: 'danger'
        }
      ]
    });
  }

  async notifyProducerRequestApproved(producerId, requestId, tokenId, certifierName) {
    return this.createNotification({
      recipient: producerId,
      type: 'credit_request_approved',
      title: '🎉 Credit Request Approved!',
      message: `Your credit request has been approved by ${certifierName} and minted on the blockchain.`,
      content: `Token ID: ${tokenId}\nYour green credits are now available for trading.`,
      relatedEntity: {
        type: 'Credit',
        id: requestId
      },
      priority: 'High',
      category: 'Credit',
      actions: [
        {
          label: 'View Credits',
          action: 'view_credits',
          url: '/producer/credits',
          style: 'success'
        },
        {
          label: 'Trade Credits',
          action: 'trade_credits',
          url: '/producer/credits/trade',
          style: 'primary'
        }
      ]
    });
  }

  async notifyProducerRequestRejected(producerId, requestId, reason, details, certifierName) {
    return this.createNotification({
      recipient: producerId,
      type: 'credit_request_rejected',
      title: 'Credit Request Rejected',
      message: `Your credit request has been rejected by ${certifierName}.`,
      content: `Reason: ${reason}\nDetails: ${details}\n\nPlease review the feedback and resubmit if needed.`,
      relatedEntity: {
        type: 'Request',
        id: requestId
      },
      priority: 'Normal',
      category: 'Credit',
      actions: [
        {
          label: 'View Feedback',
          action: 'view_feedback',
          url: '/producer/requests',
          style: 'secondary'
        },
        {
          label: 'Submit New Request',
          action: 'new_request',
          url: '/producer/requests/new',
          style: 'primary'
        }
      ]
    });
  }

  // Get notifications for a user
  async getUserNotifications(userId, limit = 20, status = 'Unread') {
    return Notification.getUnreadForUser(userId, limit);
  }

  // Mark notifications as read
  async markNotificationsAsRead(notificationIds, userId) {
    return Notification.markAsRead(notificationIds, userId);
  }

  // Archive old notifications
  async archiveOldNotifications(daysOld = 30) {
    return Notification.archiveOldNotifications(daysOld);
  }
}

module.exports = new NotificationService();
