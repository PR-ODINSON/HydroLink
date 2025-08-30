const Credit = require('../models/credit.model');
const Request = require('../models/request.model');
const User = require('../models/user.model');
const Request = require('../models/request.model');
const Notification = require('../models/notification.model');
const { mintCredit } = require('../../services/blockchain.service');
<<<<<<< HEAD
const notificationService = require('../../services/notification.service');

// @desc    Get all requests pending certification
// @route   GET /api/certifier/requests/pending
exports.getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await Request.find({ 
            status: { $in: ['Pending', 'Under Review'] } 
        })
        .populate('producer', 'name email walletAddress')
        .populate('assignedCertifier', 'name email')
        .sort({ 'audit.submittedAt': 1 }); // Oldest first
        res.status(200).json({ success: true, data: pendingRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all credits pending certification (legacy endpoint)
=======
const notificationService = require('../../services/notificationService');
const { sendEmail } = require('../../services/emailService');

// @desc    Get all credits pending certification (legacy)
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c
// @route   GET /api/certifier/credits/pending
exports.getPendingCredits = async (req, res) => {
    try {
        const pendingCredits = await Credit.find({ status: 'Pending' }).populate('producer', 'name walletAddress');
        res.status(200).json({ success: true, data: pendingCredits });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

<<<<<<< HEAD
// @desc    Approve a request and mint it on the blockchain
// @route   POST /api/certifier/requests/:id/approve
exports.approveRequest = async (req, res) => {
    const requestId = req.params.id;
    const { comments = '' } = req.body || {};
    
    try {
        const request = await Request.findById(requestId);
        if (!request || !['Pending', 'Under Review'].includes(request.status)) {
            return res.status(404).json({ 
                success: false, 
                message: 'Request not found or not in pending/under review state.' 
            });
        }

        const producer = await User.findById(request.producer);
        if (!producer || !producer.walletAddress) {
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
        const mintResult = await mintCredit(producer.walletAddress, metadataUri);
        
        if (!mintResult.success) {
            // If blockchain minting fails, we should handle this gracefully
            console.error('Blockchain minting failed:', mintResult.error);
            // For now, we'll still mark the credit as certified but note the blockchain issue
            newCredit.status = 'Certified';
            newCredit.blockchainError = mintResult.error;
        } else {
            // Update credit with blockchain data
            newCredit.tokenId = mintResult.tokenId;
            newCredit.blockchain = {
                txHash: mintResult.txHash,
                blockNumber: mintResult.blockNumber,
                network: 'polygon'
            };
        }

        await newCredit.save();

        // Send notification to producer
        await notificationService.notifyProducerRequestApproved(
            request.producer,
            request._id,
            newCredit.tokenId || 'Pending',
            req.user.name
        );

        // Remove the request from the database as per workflow
        await Request.findByIdAndDelete(requestId);

        res.status(200).json({ 
            success: true, 
            message: 'Request approved and credit minted successfully.', 
            data: {
                credit: newCredit,
                tokenId: newCredit.tokenId
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
    const { reason, details = '' } = req.body;
    
    try {
        const request = await Request.findById(requestId);
        if (!request || !['Pending', 'Under Review'].includes(request.status)) {
            return res.status(404).json({ 
                success: false, 
                message: 'Request not found or not in pending/under review state.' 
            });
        }

        // Reject the request
        await request.reject(req.user._id, reason, details);

        // Send notification to producer
        await notificationService.notifyProducerRequestRejected(
            request.producer,
            request._id,
            reason,
            details,
            req.user.name
        );

        // Remove the request from the database as per workflow
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

        // Assign the request to the current certifier
        await request.assignCertifier(req.user._id);

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
=======
// @desc    Approve a credit and mint it on the blockchain (legacy)
>>>>>>> f5f6c5c01a3e82df069ea30fc3675e2180d73b2c
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

// @desc    Get all pending credit requests
// @route   GET /api/certifier/requests/pending
exports.getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await Request.find({ status: 'Pending' })
            .populate('producer', 'name email walletAddress');
        res.status(200).json({ success: true, data: pendingRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Approve a credit request, mint on blockchain, create Credit, notify producer, remove request
// @route   POST /api/certifier/requests/:id/approve
exports.approveRequest = async (req, res) => {
    const requestId = req.params.id;
    try {
        const request = await Request.findById(requestId).populate('producer', 'walletAddress email name');
        if (!request || request.status !== 'Pending') {
            return res.status(404).json({ success: false, message: 'Request not found or not pending.' });
        }
        if (!request.producer.walletAddress) {
            return res.status(400).json({ success: false, message: 'Producer wallet address not found.' });
        }
        // Mint on blockchain
        const metadataUri = `https://api.yourproject.com/credits/request/${request._id}/metadata`;
        const mintResult = await mintCredit(request.producer.walletAddress, metadataUri);
        if (!mintResult.success) {
            return res.status(500).json({ success: false, message: 'Blockchain minting failed.', error: mintResult.error });
        }
        // Create Credit entry
        const newCredit = new Credit({
            producer: request.producer._id,
            productionDate: request.productionDate,
            energyAmountMWh: request.energyAmountMWh,
            proofDocumentUrl: request.proofDocumentUrl,
            facilityName: request.facilityName,
            facilityLocation: request.facilityLocation,
            energySource: request.energySource,
            additionalDocuments: request.additionalDocuments,
            status: 'Certified',
            certifier: req.user._id,
            tokenId: mintResult.tokenId,
            blockchain: { mintTxHash: mintResult.txHash },
        });
        await newCredit.save();
        // Remove request
        await request.deleteOne();
        // Notify producer (in-app and email)
        await notificationService.notifyProducerApproved(request.producer._id, newCredit);
        if (request.producer.email) {
            await sendEmail({
                to: request.producer.email,
                subject: 'Your Credit Request Has Been Approved',
                text: 'Congratulations! Your credit request has been approved and minted on the blockchain.',
                html: '<p>Congratulations! Your credit request has been <b>approved</b> and minted on the blockchain.</p>'
            });
        }
        res.status(200).json({ success: true, message: 'Request approved, credit minted and certified.', data: newCredit });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Reject a credit request, notify producer, remove request
// @route   POST /api/certifier/requests/:id/reject
exports.rejectRequest = async (req, res) => {
    const requestId = req.params.id;
    const { reason } = req.body;
    try {
        const request = await Request.findById(requestId).populate('producer', 'email name');
        if (!request || request.status !== 'Pending') {
            return res.status(404).json({ success: false, message: 'Request not found or not pending.' });
        }
        // Remove request
        await request.deleteOne();
        // Notify producer (in-app and email)
        await notificationService.notifyProducerRejected(request.producer._id, reason);
        if (request.producer.email) {
            await sendEmail({
                to: request.producer.email,
                subject: 'Your Credit Request Was Rejected',
                text: `Your credit request was rejected. Reason: ${reason || 'No reason provided.'}`,
                html: `<p>Your credit request was <b>rejected</b>.<br>Reason: ${reason || 'No reason provided.'}</p>`
            });
        }
        res.status(200).json({ success: true, message: 'Request rejected and removed.' });
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
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
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
      { read: true },
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
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};