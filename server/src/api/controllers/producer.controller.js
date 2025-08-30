const Credit = require('../models/credit.model');
const Request = require('../models/request.model');
const Facility = require('../models/facility.model');
const Transaction = require('../models/transaction.model');
const { ProductionAnalytics } = require('../models/analytics.model');
const { Achievement, UserAchievement } = require('../models/achievement.model');
const notificationService = require('../../services/notification.service');
const User = require('../models/user.model');

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
    // Generate unique request ID
    const requestId = Request.generateRequestId();
    
    // Create new request
    const newRequest = new Request({
      requestId,
      producer: req.user._id,
      productionDate,
      energyAmountMWh,
      proofDocumentUrl,
      facilityName,
      facilityLocation,
      energySource,
      additionalDocuments: additionalDocuments || [],
      status: 'Pending',
      metadata: {
        priority: 'Normal',
        source: 'Web Portal'
      }
    });

    const savedRequest = await newRequest.save();

    // Send notification to producer
    await notificationService.notifyCreditRequestSubmitted(
      req.user._id,
      savedRequest._id,
      {
        energyAmountMWh,
        energySource,
        facilityName,
        facilityLocation,
        productionDate
      }
    );

    // Find available certifiers and assign one (or notify all)
    const certifiers = await User.find({ 
      role: 'Certifier',
      'preferences.notifications.email': true 
    });

    // For now, notify all certifiers. In a more sophisticated system,
    // you might assign to a specific certifier based on workload, specialization, etc.
    for (const certifier of certifiers) {
      await notificationService.notifyCertifierNewRequest(
        certifier._id,
        savedRequest._id,
        {
          energyAmountMWh,
          energySource,
          facilityName,
          facilityLocation,
          productionDate
        },
        req.user.name
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
        const requests = await Request.find({ producer: req.user._id })
            .populate('assignedCertifier', 'name email')
            .populate('review.reviewedBy', 'name email')
            .sort({ 'audit.submittedAt': -1 });
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

        // Get total production
        const totalProduction = await Credit.aggregate([
            { $match: { producer: userId, status: 'Certified' } },
            { $group: { _id: null, total: { $sum: '$energyAmountMWh' } } }
        ]);

        // Get facilities count
        const facilitiesCount = await Facility.countDocuments({ owner: userId });

        // Get achievements progress
        const achievements = await UserAchievement.getUserStats(userId);

        // Calculate efficiency (simplified)
        const avgEfficiency = 94.2; // This would come from production analytics

        res.status(200).json({
            success: true,
            data: {
                credits: {
                    total: creditStats.reduce((sum, stat) => sum + stat.count, 0),
                    byStatus: creditStats
                },
                production: {
                    total: totalProduction[0]?.total || 0,
                    efficiency: avgEfficiency
                },
                facilities: facilitiesCount,
                achievements: achievements
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get producer facilities
// @route   GET /api/producer/facilities
exports.getFacilities = async (req, res) => {
    try {
        const facilities = await Facility.findByOwner(req.user._id);
        res.status(200).json({ success: true, data: facilities });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Create new facility
// @route   POST /api/producer/facilities
exports.createFacility = async (req, res) => {
    try {
        const facilityData = {
            ...req.body,
            owner: req.user._id
        };
        
        const facility = new Facility(facilityData);
        await facility.save();
        
        res.status(201).json({ success: true, data: facility });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get production analytics
// @route   GET /api/producer/analytics
exports.getAnalytics = async (req, res) => {
    try {
        const { period = 'monthly', limit = 12 } = req.query;
        const userId = req.user._id;
        
        // Get production trends
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - parseInt(limit));
        
        const analytics = await ProductionAnalytics.find({
            owner: userId,
            period: period,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 }).limit(parseInt(limit));
        
        // Get efficiency stats
        const efficiencyStats = await ProductionAnalytics.getEfficiencyStats(userId, period);
        
        res.status(200).json({
            success: true,
            data: {
                trends: analytics.reverse(),
                efficiency: efficiencyStats[0] || {}
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get user achievements
// @route   GET /api/producer/achievements
exports.getAchievements = async (req, res) => {
    try {
        const userAchievements = await UserAchievement.findByUser(req.user._id);
        const stats = await UserAchievement.getUserStats(req.user._id);
        
        res.status(200).json({
            success: true,
            data: {
                achievements: userAchievements,
                stats: stats
            }
        });
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