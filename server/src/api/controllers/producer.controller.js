const Credit = require('../models/credit.model');
const Facility = require('../models/facility.model');
const Transaction = require('../models/transaction.model');
const { ProductionAnalytics } = require('../models/analytics.model');
const { Achievement, UserAchievement } = require('../models/achievement.model');
const Request = require('../models/request.model');
const User = require('../models/user.model');
const notificationService = require('../../services/notificationService');
const { sendEmail } = require('../../services/emailService');
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
    additionalDocuments,
    notes
  } = req.body;

  try {
    // Store the request in the Request model
    const newRequest = new Request({
      producer: req.user._id, // from auth middleware
      productionDate,
      energyAmountMWh,
      proofDocumentUrl,
      facilityName,
      facilityLocation,
      energySource,
      additionalDocuments: additionalDocuments || [],
      notes: notes || ''
    });
    const savedRequest = await newRequest.save();

    // Find all certifiers
    const certifiers = await User.find({ role: 'Certifier', 'preferences.notifications.email': true });
    for (const certifier of certifiers) {
      // In-app notification
      await notificationService.notifyCertifierNewRequest(certifier._id, { producer: req.user, _id: savedRequest._id });
      // Email notification
      if (certifier.email) {
        await sendEmail({
          to: certifier.email,
          subject: 'New Credit Request Submitted',
          text: `A new credit request has been submitted by ${req.user.name || 'a producer'}. Please review and approve/reject in the dashboard.`,
          html: `<p>A new credit request has been submitted by <b>${req.user.name || 'a producer'}</b>.<br> Please review and approve/reject in the dashboard.</p>`
        });
      }
    }

    res.status(201).json({ success: true, data: savedRequest });
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

// @desc    Get all notifications for the logged-in user
// @route   GET /api/producer/notifications
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
// @route   PATCH /api/producer/notifications/:id/read
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
// @route   PATCH /api/producer/notifications/read-all
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