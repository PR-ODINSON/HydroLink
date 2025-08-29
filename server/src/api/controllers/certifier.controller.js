const Credit = require('../models/credit.model');
const User = require('../models/user.model');
const blockchainService = require('../../services/blockchain.service');

// @desc    Get all credits pending certification
// @route   GET /api/certifier/credits/pending
exports.getPendingCredits = async (req, res) => {
    try {
        const pendingCredits = await Credit.find({ status: 'Pending' }).populate('producer', 'name walletAddress');
        res.status(200).json({ success: true, data: pendingCredits });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Approve a credit and mint it on the blockchain
// @route   POST /api/certifier/credits/:id/approve
exports.approveCredit = async (req, res) => {
    const creditId = req.params.id;

    try {
        const credit = await Credit.findById(creditId);
        if (!credit || credit.status !== 'Pending') {
            return res.status(404).json({ success: false, message: 'Credit not found or not in pending state.' });
        }
        
        const producer = await User.findById(credit.producer);
        if (!producer || !producer.walletAddress) {
            return res.status(400).json({ success: false, message: 'Producer wallet address not found.' });
        }

        // 1. Call blockchain service to mint the token
        // The metadataUri could be a link to an IPFS hash of the credit details
        const metadataUri = `https://api.yourproject.com/credits/${credit._id}/metadata`;
        const mintResult = await blockchainService.mintCredit(producer.walletAddress, metadataUri);

        if (!mintResult.success) {
            return res.status(500).json({ success: false, message: 'Blockchain minting failed.', error: mintResult.error });
        }

        // 2. Update the credit in our database
        // In a real app, you'd get the tokenId from the transaction receipt/event
        credit.status = 'Certified';
        credit.certifier = req.user._id;
        credit.tokenId = mintResult.txHash; // Using txHash as a placeholder for tokenId
        await credit.save();

        res.status(200).json({ success: true, message: 'Credit certified and minted successfully.', data: credit });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};