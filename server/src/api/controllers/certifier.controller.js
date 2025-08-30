const Credit = require('../models/credit.model');
const User = require('../models/user.model');
const Request = require('../models/request.model');
const Notification = require('../models/notification.model');
const { mintCredit } = require('../../services/blockchain.service');

// @desc    Get all requests pending certification
// @route   GET /api/certifier/requests/pending
exports.getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await Request.findPendingRequests();
        res.status(200).json({ success: true, data: pendingRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all credits pending certification (legacy endpoint)
// @route   GET /api/certifier/credits/pending
exports.getPendingCredits = async (req, res) => {
    try {
        const pendingCredits = await Credit.find({ status: 'Pending' }).populate('producer', 'name walletAddress');
        res.status(200).json({ success: true, data: pendingCredits });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Approve a request and mint it on the blockchain
// @route   POST /api/certifier/requests/:id/approve
exports.approveRequest = async (req, res) => {
    const requestId = req.params.id;
    const { comments = '' } = req.body || {};
    
    try {
        // Find the request
        const request = await Request.findById(requestId).populate('producer', 'name email walletAddress');
        if (!request || !['Pending', 'Under Review'].includes(request.status)) {
            return res.status(404).json({ 
                success: false, 
                message: 'Request not found or not in pending/under review state.' 
            });
        }

        if (!request.producer.walletAddress) {
            return res.status(400).json({ 
                success: false, 
                message: 'Producer wallet address not found.' 
            });
        }

        // Approve the request
        await request.approve(req.user._id, comments);

        // Create credit from approved request
        const creditData = request.toCreditData();
        const newCredit = new Credit(creditData);
        await newCredit.save();

        // Mint on blockchain
        const metadataUri = `${process.env.API_URL || 'https://api.hydrolink.com'}/credits/${newCredit._id}/metadata`;
        const mintResult = await mintCredit(request.producer.walletAddress, metadataUri);
        
        if (!mintResult.success) {
            console.error('Blockchain minting failed:', mintResult.error);
            newCredit.blockchainError = mintResult.error;
        } else {
            newCredit.tokenId = mintResult.tokenId;
            newCredit.blockchain = {
                txHash: mintResult.txHash,
                blockNumber: mintResult.blockNumber,
                network: 'polygon'
            };
        }

        await newCredit.save();

        // Send notification to producer
        await Notification.createRequestApprovedNotification(
            request.producer._id,
            {
                energyAmountMWh: request.energyAmountMWh,
                facilityName: request.facilityName,
                creditId: newCredit._id
            },
            req.user.name,
            newCredit.tokenId || 'Mocked Token'
        );

        // Remove the request from database as it's now processed
        await Request.findByIdAndDelete(requestId);

        res.status(200).json({ 
            success: true, 
            message: 'Request approved and credit minted successfully.', 
            data: {
                credit: newCredit,
                tokenId: newCredit.tokenId || 'Mocked Token'
            }
        });
    } catch (error) {
        console.error('Error in approveRequest:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Reject a request
// @route   POST /api/certifier/requests/:id/reject
exports.rejectRequest = async (req, res) => {
    const requestId = req.params.id;
    const { rejectionReason = 'Did not meet certification requirements', comments = '' } = req.body;
    
    try {
        // Find the request
        const request = await Request.findById(requestId).populate('producer', 'name email');
        if (!request || !['Pending', 'Under Review'].includes(request.status)) {
            return res.status(404).json({ 
                success: false, 
                message: 'Request not found or not in pending/under review state.' 
            });
        }

        // Reject the request
        await request.reject(req.user._id, rejectionReason, comments);

        // Send notification to producer
        await Notification.createRequestRejectedNotification(
            request.producer._id,
            {
                energyAmountMWh: request.energyAmountMWh,
                facilityName: request.facilityName,
                requestId: request._id
            },
            req.user.name,
            rejectionReason
        );

        // Remove the request from database as it's now processed
        await Request.findByIdAndDelete(requestId);

        res.status(200).json({ 
            success: true, 
            message: 'Request rejected successfully.' 
        });
    } catch (error) {
        console.error('Error in rejectRequest:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Assign a request to a certifier
// @route   POST /api/certifier/requests/:id/assign
exports.assignRequest = async (req, res) => {
    const requestId = req.params.id;
    
    try {
        const request = await Request.findById(requestId);
        if (!request || request.status !== 'Pending') {
            return res.status(404).json({ 
                success: false, 
                message: 'Request not found or not in pending state.' 
            });
        }

        // Assign the request to the current certifier for review
        await request.assignToCertifier(req.user._id);

        res.status(200).json({ 
            success: true, 
            message: 'Request assigned successfully.',
            data: request
        });
    } catch (error) {
        console.error('Error in assignRequest:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Approve a credit and mint it on the blockchain (legacy endpoint)
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
        credit.blockchain = { mintTxHash: mintResult.txHash };
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

        // Get pending requests count
        const pendingCount = await Request.countDocuments({ 
            status: { $in: ['Pending', 'Under Review'] }
        });

        // Get rejected requests count (from audit trail or separate tracking)
        const rejectedCount = 0; // This would need to be tracked separately or in audit logs

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

// @desc    Get all notifications for the logged-in certifier
// @route   GET /api/certifier/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findForUser(req.user._id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/certifier/notifications/:id/read
exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true, readAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/certifier/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.markAllAsReadForUser(req.user._id);
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};