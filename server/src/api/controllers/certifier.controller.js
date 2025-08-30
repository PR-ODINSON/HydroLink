const Credit = require('../models/credit.model');
const User = require('../models/user.model');
const { mintCredit } = require('../../services/blockchain.service');

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
        // The metadataUri could be a link to an IPFS hash of the credit details
        const metadataUri = `https://api.yourproject.com/credits/${credit._id}/metadata`;
        const mintResult = await mintCredit(producer.walletAddress, metadataUri);
        if (!mintResult.success) {
            return res.status(500).json({ success: false, message: 'Blockchain minting failed.', error: mintResult.error });
        }
        // Update the credit in our database
        credit.status = 'Certified';
        credit.certifier = req.user._id;
        credit.tokenId = mintResult.tokenId;
        credit.txHash = mintResult.txHash;
        await credit.save();
        res.status(200).json({ success: true, message: 'Credit certified and minted successfully.', data: credit });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get certifier dashboard stats
// @route   GET /api/certifier/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const certifierId = req.user._id;
        
        // Get credit stats by status
        const creditStats = await Credit.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalEnergy: { $sum: '$energyAmountMWh' }
                }
            }
        ]);

        // Get credits verified by this certifier
        const verifiedByCertifier = await Credit.countDocuments({ 
            certifier: certifierId,
            status: 'Certified'
        });

        // Get pending credits count
        const pendingCount = await Credit.countDocuments({ status: 'Pending' });

        // Get rejected credits count
        const rejectedCount = await Credit.countDocuments({ status: 'Rejected' });

        // Get total credits verified
        const totalVerified = await Credit.countDocuments({ status: 'Certified' });

        // Calculate approval rate
        const totalProcessed = totalVerified + rejectedCount;
        const approvalRate = totalProcessed > 0 ? (totalVerified / totalProcessed) * 100 : 0;

        // Get recent activities (last 10 credits processed by this certifier)
        const recentActivities = await Credit.find({ 
            certifier: certifierId 
        })
        .populate('producer', 'name')
        .sort({ updatedAt: -1 })
        .limit(10)
        .select('status energyAmountMWh producer updatedAt');

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    creditsVerified: totalVerified,
                    pendingRequests: pendingCount,
                    approvalRate: Math.round(approvalRate * 10) / 10, // Round to 1 decimal
                    fraudDetected: rejectedCount // Simplified - in real app this would be separate
                },
                creditBreakdown: creditStats,
                recentActivities: recentActivities
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};