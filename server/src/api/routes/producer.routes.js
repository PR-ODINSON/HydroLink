const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const {
  requestCreditMinting,
  getProducerCredits,
  getDashboardStats,
  getFacilities,
  createFacility,
  getAnalytics,
  getAchievements,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} = require('../controllers/producer.controller');

const router = express.Router();

router.use(protect);
router.use(authorize('Producer'));

// Credit routes
router.route('/credits')
    .post(requestCreditMinting)
    .get(getProducerCredits);

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// Facility routes
router.route('/facilities')
    .get(getFacilities)
    .post(createFacility);

// Analytics
router.get('/analytics', getAnalytics);

// Achievements
router.get('/achievements', getAchievements);

// Notification routes
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);

module.exports = router;