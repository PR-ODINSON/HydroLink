const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { 
    requestCreditMinting, 
    getProducerRequests,
    getProducerCredits,
    getDashboardStats,
    updateWalletAddress,
    getPendingSaleRequests,
    acceptSaleRequest,
    rejectSaleRequest,
    getSaleHistory,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
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

// Sales routes
router.get('/sales/pending', getPendingSaleRequests);
router.post('/sales/:transactionId/accept', acceptSaleRequest);
router.post('/sales/:transactionId/reject', rejectSaleRequest);
router.get('/sales/history', getSaleHistory);

// Notification routes
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);

// Wallet routes
router.put('/wallet', updateWalletAddress);

module.exports = router;