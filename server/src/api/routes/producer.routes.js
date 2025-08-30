const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
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
} = require('../controllers/producer.controller');

const router = express.Router();

// All routes here are protected and require a logged-in user
router.use(protect);

// Only users with the 'Producer' role can access these routes
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

// Analytics routes
router.get('/analytics', getAnalytics);

// Achievement routes
router.get('/achievements', getAchievements);

// Wallet routes
router.put('/wallet', updateWalletAddress);

module.exports = router;