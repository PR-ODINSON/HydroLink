const notificationService = require('../../services/notification.service');
const Notification = require('../models/notification.model');

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
exports.getNotifications = async (req, res) => {
    try {
        const { limit = 20, status = 'Unread' } = req.query;
        const userId = req.user._id;

        let notifications;
        if (status === 'All') {
            notifications = await Notification.find({ recipient: userId })
                .populate('sender', 'name email')
                .populate('relatedEntity.id')
                .sort({ createdAt: -1 })
                .limit(parseInt(limit));
        } else {
            notifications = await notificationService.getUserNotifications(userId, parseInt(limit), status);
        }

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: error.message 
        });
    }
};

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationIds } = req.body;
        const userId = req.user._id;

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return res.status(400).json({
                success: false,
                message: 'Notification IDs array is required'
            });
        }

        const result = await notificationService.markNotificationsAsRead(notificationIds, userId);

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} notifications marked as read`,
            data: { modifiedCount: result.modifiedCount }
        });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: error.message 
        });
    }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
exports.markSingleAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        const notification = await Notification.findOne({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.markAsRead();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: error.message 
        });
    }
};

// @desc    Archive a notification
// @route   PUT /api/notifications/:id/archive
exports.archiveNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        const notification = await Notification.findOne({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.archive();

        res.status(200).json({
            success: true,
            message: 'Notification archived',
            data: notification
        });
    } catch (error) {
        console.error('Error archiving notification:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: error.message 
        });
    }
};

// @desc    Get notification count for the logged-in user
// @route   GET /api/notifications/count
exports.getNotificationCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            status: 'Unread',
            $or: [
                { 'metadata.expiresAt': null },
                { 'metadata.expiresAt': { $gt: new Date() } }
            ]
        });

        res.status(200).json({
            success: true,
            data: { unreadCount }
        });
    } catch (error) {
        console.error('Error getting notification count:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: error.message 
        });
    }
};
