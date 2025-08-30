const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const {
  getDashboardStats,
  getAvailableCredits,
  purchaseCredit,
  getPurchaseHistory,
  retireCredit,
  getRetiredCredits,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} = require('../controllers/buyer.controller');

const router = express.Router();

router.use(protect);
router.use(authorize('Buyer'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Credits
router.get('/credits/available', getAvailableCredits);
router.post('/credits/:creditId/purchase', purchaseCredit);
router.get('/credits/purchase-history', getPurchaseHistory);
router.post('/credits/:tokenId/retire', retireCredit);
router.get('/credits/retired', getRetiredCredits);

// Notification routes
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);

module.exports = router;