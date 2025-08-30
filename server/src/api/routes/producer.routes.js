const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
<<<<<<< HEAD
const { 
    requestCreditMinting, 
    getProducerRequests,
    getProducerCredits,
    getDashboardStats,
    getFacilities,
    createFacility,
    getAnalytics,
    getAchievements,
    updateWalletAddress
=======
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
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c
} = require('../controllers/producer.controller');

const router = express.Router();

router.use(protect);
router.use(authorize('Producer'));

// Request routes
router.route('/requests')
    .get(getProducerRequests);

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

<<<<<<< HEAD
// Wallet routes
router.put('/wallet', updateWalletAddress);
=======
// Notification routes
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c

module.exports = router;