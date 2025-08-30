const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} = require('../controllers/notification.controller');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);

module.exports = router;
