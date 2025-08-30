const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
<<<<<<< HEAD
    getNotifications,
    markAsRead,
    markSingleAsRead,
    archiveNotification,
    getNotificationCount
=======
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c
} = require('../controllers/notification.controller');

const router = express.Router();

<<<<<<< HEAD
// All routes here are protected and require a logged-in user
router.use(protect);

// Notification routes
router.get('/', getNotifications);
router.get('/count', getNotificationCount);
router.put('/read', markAsRead);
router.put('/:id/read', markSingleAsRead);
router.put('/:id/archive', archiveNotification);
=======
router.use(protect);

router.get('/', getNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c

module.exports = router;
