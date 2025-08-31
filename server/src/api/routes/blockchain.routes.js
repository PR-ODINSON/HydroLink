const express = require('express');
const router = express.Router();
const { getBalance } = require('../../services/blockchain.service');
const { protect } = require('../middlewares/auth.middleware');

// @desc    Get wallet balance
// @route   GET /api/blockchain/balance/:address
// @access  Private
router.get('/balance/:address', protect, async (req, res) => {
  try {
    const { address } = req.params;
    
    console.log('🔍 Fetching balance for address:', address);
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    // Get balance from blockchain service
    const balanceResult = await getBalance(address);
    console.log('💰 Balance result:', balanceResult);
    
    if (balanceResult.success) {
      return res.json({
        success: true,
        balance: balanceResult.balance,
        message: 'Balance retrieved successfully'
      });
    } else {
      console.error('❌ Balance retrieval failed:', balanceResult.error);
      return res.status(500).json({
        success: false,
        message: balanceResult.error || 'Failed to retrieve balance'
      });
    }
  } catch (error) {
    console.error('💥 Error getting wallet balance:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
