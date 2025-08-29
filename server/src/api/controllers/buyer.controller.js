const Credit = require('../models/credit.model');
const blockchainService = require('../../services/blockchain.service');


// @desc    Get all certified credits available for purchase/viewing
// @route   GET /api/buyer/credits/marketplace
exports.getMarketplaceCredits = async (req, res) => {
    try {
        const certifiedCredits = await Credit.find({ status: 'Certified' }).populate('producer', 'name');
        res.status(200).json({ success: true, data: certifiedCredits });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


// @desc    Retire a certified credit
// @route   POST /api/buyer/credits/:tokenId/retire
exports.retireCredit = async (req, res) => {
    const { tokenId } = req.params;

    try {
        const credit = await Credit.findOne({ tokenId: tokenId });
        if (!credit || credit.status !== 'Certified') {
            return res.status(404).json({ success: false, message: 'Certified credit with this Token ID not found.' });
        }

        // 1. Call blockchain service to retire the token
        const retireResult = await blockchainService.retireCredit(tokenId);

        if (!retireResult.success) {
            return res.status(500).json({ success: false, message: 'Blockchain retire failed.', error: retireResult.error });
        }
        
        // 2. Update the credit in our database
        credit.status = 'Retired';
        await credit.save();

        res.status(200).json({ success: true, message: 'Credit retired successfully.', data: credit });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};