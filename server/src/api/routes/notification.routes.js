const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
    getNotifications,
    markAsRead,
    markSingleAsRead,
    archiveNotification,
    getNotificationCount
} = require('../controllers/notification.controller');

const router = express.Router();

// All routes here are protected and require a logged-in user
router.use(protect);

// Notification routes
router.get('/', getNotifications);
router.get('/count', getNotificationCount);
router.put('/read', markAsRead);
router.put('/:id/read', markSingleAsRead);
router.put('/:id/archive', archiveNotification);

module.exports = router;
