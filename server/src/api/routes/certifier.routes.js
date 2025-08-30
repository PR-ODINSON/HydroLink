const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
<<<<<<< HEAD
const { 
    getPendingRequests, 
    getPendingCredits, 
    approveRequest, 
    rejectRequest, 
    assignRequest,
    approveCredit, 
    getDashboardStats 
=======
const {
  getPendingCredits,
  approveCredit,
  getDashboardStats,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c
} = require('../controllers/certifier.controller');

const router = express.Router();

router.use(protect);
router.use(authorize('Certifier'));

// Dashboard route
router.get('/dashboard', getDashboardStats);

<<<<<<< HEAD
// Request routes (new workflow)
router.get('/requests/pending', getPendingRequests);
router.post('/requests/:id/assign', assignRequest);
router.post('/requests/:id/approve', approveRequest);
router.post('/requests/:id/reject', rejectRequest);

=======
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c
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