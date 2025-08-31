const Credit = require('../models/credit.model');
const Request = require('../models/request.model');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

// @desc    Request minting for a new credit
// @route   POST /api/producer/credits
exports.requestCreditMinting = async (req, res) => {
  const {
    productionDate,
    energyAmountMWh,
    proofDocumentUrl,
    facilityName,
    facilityLocation,
    energySource,
    additionalDocuments
  } = req.body;

  try {
    // Create new request
    const newRequest = new Request({
      producer: req.user._id,
      productionDate: new Date(productionDate),
      energyAmountMWh: parseFloat(energyAmountMWh),
      proofDocumentUrl,
      facilityName,
      facilityLocation,
      energySource,
      additionalDocuments: additionalDocuments || [],
      status: 'Pending'
    });

    const savedRequest = await newRequest.save();

    // Find all certifiers and notify them
    const certifiers = await User.find({ 
      role: 'Certifier'
    });

    // Create notifications for all certifiers
    if (certifiers.length > 0) {
      await Notification.createRequestSubmittedNotification(
        certifiers.map(c => c._id),
        {
          requestId: savedRequest._id,
          producerName: req.user.name,
          energyAmountMWh,
          facilityName,
          energySource
        }
      );
    }

    res.status(201).json({ 
      success: true, 
      data: savedRequest,
      message: 'Credit request submitted successfully. You will be notified once it is reviewed.'
    });
  } catch (error) {
    console.error('Error in requestCreditMinting:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all requests for the logged-in producer
// @route   GET /api/producer/requests
exports.getProducerRequests = async (req, res) => {
    try {
        const requests = await Request.findByProducer(req.user._id);
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all credits for the logged-in producer
// @route   GET /api/producer/credits
exports.getProducerCredits = async (req, res) => {
    try {
        const credits = await Credit.find({ producer: req.user._id }).populate('certifier', 'name');
        res.status(200).json({ success: true, data: credits });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get producer dashboard stats
// @route   GET /api/producer/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get credit stats
        const creditStats = await Credit.aggregate([
            { $match: { producer: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalEnergy: { $sum: '$energyAmountMWh' }
                }
            }
        ]);

        // Get request stats
        const requestStats = await Request.aggregate([
            { $match: { producer: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalEnergy: { $sum: '$energyAmountMWh' }
                }
            }
        ]);

        // Get total production
        const totalProduction = await Credit.aggregate([
            { $match: { producer: userId, status: 'Certified' } },
            { $group: { _id: null, total: { $sum: '$energyAmountMWh' } } }
        ]);

        // Get unread notifications count
        const unreadNotifications = await Notification.getUnreadCountForUser(userId);

        res.status(200).json({
            success: true,
            data: {
                credits: {
                    total: creditStats.reduce((sum, stat) => sum + stat.count, 0),
                    byStatus: creditStats
                },
                requests: {
                    total: requestStats.reduce((sum, stat) => sum + stat.count, 0),
                    byStatus: requestStats
                },
                production: {
                    total: totalProduction[0]?.total || 0,
                    efficiency: 94.2 // Mock efficiency
                },
                notifications: {
                    unread: unreadNotifications
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all notifications for the logged-in producer
// @route   GET /api/producer/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findForUser(req.user._id);
    console.log(`Found ${notifications.length} notifications for producer ${req.user._id}`);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get pending sale requests for producer
// @route   GET /api/producer/sales/pending
exports.getPendingSaleRequests = async (req, res) => {
  try {
    // Find producer's credits
    const producerCredits = await Credit.find({ producer: req.user._id }, '_id');
    const creditIds = producerCredits.map(c => c._id);
    
    // Find pending requests for producer's credits
    const pendingRequests = await Transaction.find({ 
      credit: { $in: creditIds },
      status: 'pending'
    })
    .populate('credit', 'creditId energyAmountMWh facilityName energySource')
    .populate('buyer', 'name email')
    .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: pendingRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Accept sale request
// @route   POST /api/producer/sales/:transactionId/accept
exports.acceptSaleRequest = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('credit')
      .populate('buyer', 'name email');
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    
    // Verify this is the producer's credit
    if (!transaction.credit.producer.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept this request' });
    }
    
    // Check if credit can still be sold
    if (!transaction.credit.canBeSold()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credit is no longer available for sale' 
      });
    }
    
    // Update transaction status
    transaction.status = 'approved';
    transaction.responseDate = new Date();
    await transaction.save();
    
    // Mark credit as sold
    await transaction.credit.sellTobuyer(transaction.buyer._id);
    
    // Create notification for buyer
    await Notification.create({
      user: transaction.buyer._id,
      title: '✅ Purchase Request Accepted!',
      message: `Your purchase request for hydrogen credit "${transaction.credit.creditId}" has been accepted by ${req.user.name}. The credit has been transferred to your account.`,
      type: 'purchase_requested',
      priority: 'high',
      relatedModel: 'Transaction',
      relatedId: transaction._id,
      actionUrl: `/dashboard/buyer/portfolio`,
      actionText: 'View Portfolio',
      metadata: {
        producerName: req.user.name,
        creditId: transaction.credit.creditId,
        energyAmount: transaction.credit.energyAmountMWh,
        facilityName: transaction.credit.facilityName,
        acceptedAt: new Date()
      }
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Sale request accepted successfully. Credit has been transferred to the buyer.',
      data: transaction 
    });
  } catch (error) {
    console.error('Error accepting sale request:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Reject sale request
// @route   POST /api/producer/sales/:transactionId/reject
exports.rejectSaleRequest = async (req, res) => {
  try {
    const { rejectionReason = 'No reason provided' } = req.body;
    
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('credit')
      .populate('buyer', 'name email');
      
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    
    // Verify this is the producer's credit
    if (!transaction.credit.producer.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to reject this request' });
    }
    
    transaction.status = 'rejected';
    transaction.responseDate = new Date();
    await transaction.save();
    
    // Create notification for buyer
    await Notification.create({
      user: transaction.buyer._id,
      title: '❌ Purchase Request Rejected',
      message: `Your purchase request for hydrogen credit "${transaction.credit.creditId}" has been rejected by ${req.user.name}. Reason: ${rejectionReason}`,
      type: 'purchase_requested',
      priority: 'normal',
      relatedModel: 'Transaction',
      relatedId: transaction._id,
      actionUrl: `/marketplace`,
      actionText: 'Browse Marketplace',
      metadata: {
        producerName: req.user.name,
        creditId: transaction.credit.creditId,
        rejectionReason,
        rejectedAt: new Date()
      }
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Sale request rejected successfully',
      data: transaction 
    });
  } catch (error) {
    console.error('Error rejecting sale request:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get sale history
// @route   GET /api/producer/sales/history
exports.getSaleHistory = async (req, res) => {
  try {
    const producerCredits = await Credit.find({ producer: req.user._id }, '_id');
    const creditIds = producerCredits.map(c => c._id);
    
    const saleHistory = await Transaction.find({ 
      credit: { $in: creditIds },
      status: { $in: ['approved', 'rejected', 'completed'] }
    })
    .populate('credit', 'creditId energyAmountMWh facilityName')
    .populate('buyer', 'name email')
    .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: saleHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/producer/notifications/:id/read
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
// @route   PATCH /api/producer/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.markAllAsReadForUser(req.user._id);
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update producer wallet address
// @route   PUT /api/producer/wallet  
exports.updateWalletAddress = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { walletAddress },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Wallet address updated successfully',
      data: { walletAddress: user.walletAddress }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

