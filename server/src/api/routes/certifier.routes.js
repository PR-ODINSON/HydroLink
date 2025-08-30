const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { 
    getPendingRequests, 
    getPendingCredits, 
    approveRequest, 
    rejectRequest, 
    assignRequest,
    approveCredit, 
    getDashboardStats,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} = require('../controllers/certifier.controller');

const router = express.Router();

router.use(protect);
router.use(authorize('Certifier'));

// Dashboard route
router.get('/dashboard', getDashboardStats);

// Request routes (new workflow)
router.get('/requests/pending', getPendingRequests);
router.post('/requests/:id/assign', assignRequest);
router.post('/requests/:id/approve', approveRequest);
router.post('/requests/:id/reject', rejectRequest);

// Credit routes (legacy)
router.get('/credits/pending', getPendingCredits);
router.post('/credits/:id/approve', approveCredit);

// Request-based workflow
router.get('/requests/pending', getPendingRequests);
router.post('/requests/:id/approve', approveRequest);
router.post('/requests/:id/reject', rejectRequest);

// Notification routes
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);

module.exports = router;