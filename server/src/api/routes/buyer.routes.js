const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { getMarketplaceCredits, retireCredit } = require('../controllers/buyer.controller');

const router = express.Router();

// Marketplace can be viewed by anyone logged in
router.get('/credits/marketplace', protect, getMarketplaceCredits);

// Retiring a credit must be done by a buyer
router.post('/credits/:tokenId/retire', [protect, authorize('Buyer')], retireCredit);

module.exports = router;