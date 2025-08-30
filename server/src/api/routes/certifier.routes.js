const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { getPendingCredits, approveCredit, getDashboardStats } = require('../controllers/certifier.controller');

const router = express.Router();

router.use(protect);
router.use(authorize('Certifier'));

// Dashboard route
router.get('/dashboard', getDashboardStats);

// Credit routes
router.get('/credits/pending', getPendingCredits);
router.post('/credits/:id/approve', approveCredit);

module.exports = router;