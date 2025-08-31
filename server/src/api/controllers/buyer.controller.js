const Credit = require('../models/credit.model');
const Transaction = require('../models/transaction.model');
const { retireCredit, transferCredit, getTokenOwner } = require('../../services/blockchain.service');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// @desc    Get all available credits for purchase (smart contracts)
// @route   GET /api/buyer/credits/available
exports.getAvailableCredits = async (req, res) => {
    try {
        // Get ALL credits from database
        const allCredits = await Credit.find({})
            .populate('producer', 'name email role walletAddress')
            .populate('certifier', 'name email role walletAddress')
            .sort({ createdAt: -1 });
        
        console.log(`Returning ${allCredits.length} credits from database`);
        res.status(200).json({ success: true, data: allCredits });
    } catch (error) {
        console.error('Error fetching credits:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get purchase history for the buyer (completed transactions)
// @route   GET /api/buyer/credits/purchased
exports.getPurchasedCredits = async (req, res) => {
    try {
        const userId = req.user._id;
        const purchases = await Transaction.findCompletedByBuyer(userId);
        res.status(200).json({ success: true, data: purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get retired credits for the buyer
// @route   GET /api/buyer/credits/retired
exports.getRetiredCredits = async (req, res) => {
    try {
        const userId = req.user._id;
        const retiredCredits = await Transaction.find({
            from: userId,
            type: 'Retirement',
            status: 'Completed'
        })
        .populate('credit', 'creditId energyAmountMWh energySource facilityName')
        .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: retiredCredits });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

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
        const retireResult = await retireCredit(tokenId);

        if (!retireResult.success) {
            return res.status(500).json({ success: false, message: 'Blockchain retire failed.', error: retireResult.error });
        }
        
        // 2. Create retirement transaction record
        const retireTransaction = new Transaction({
            type: 'Retirement',
            credit: credit._id,
            from: userId,
            to: null, // Retirement doesn't have a "to" address
            amount: 1, // Assuming each credit is 1 unit
            status: 'Completed',
            blockchain: {
                txHash: retireResult.txHash,
                network: 'polygon'
            }
        });
        
        await retireTransaction.save();
        
        // 2. Update the credit in our database
        credit.status = 'Retired';
        await credit.save();

        res.status(200).json({ success: true, message: 'Credit retired successfully.', data: credit });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get buyer dashboard stats
// @route   GET /api/buyer/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get user's transactions (simplified)
        const purchaseTransactions = await Transaction.findByBuyer(userId);

        // Calculate portfolio stats
        let totalCredits = purchaseTransactions.length;

        // Get available marketplace credits count
        const marketplaceCount = await Credit.countDocuments({ status: 'Certified', isSold: false });

        // Get unread notifications count
        const unreadNotifications = await Notification.getUnreadCountForUser(userId);

        res.status(200).json({
            success: true,
            data: {
                portfolio: {
                    totalCredits,
                    totalSpent: 0, // Simplified - no pricing info
                    pendingRequests: 0 // Simplified - no pending requests
                },
                marketplace: {
                    availableCredits: marketplaceCount
                },
                transactions: {
                    total: purchaseTransactions.length,
                    completed: purchaseTransactions.length,
                    pending: 0
                },
                unreadNotifications
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get buyer portfolio
// @route   GET /api/buyer/portfolio
exports.getPortfolio = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get user's purchase transactions
        const purchases = await Transaction.find({
            to: userId,
            type: 'Purchase',
            status: 'Completed'
        }).populate('credit');

        // Get user's retirement transactions
        const retirements = await Transaction.find({
            from: userId,
            type: 'Retirement',
            status: 'Completed'
        }).populate('credit');

        // Calculate current holdings
        const holdings = {};
        purchases.forEach(transaction => {
            const creditId = transaction.credit._id.toString();
            if (!holdings[creditId]) {
                holdings[creditId] = {
                    credit: transaction.credit,
                    purchased: 0,
                    retired: 0,
                    currentAmount: 0,
                    totalPaid: 0
                };
            }
            holdings[creditId].purchased += transaction.amount;
            holdings[creditId].totalPaid += transaction.totalValue || 0;
        });

        retirements.forEach(transaction => {
            const creditId = transaction.credit._id.toString();
            if (holdings[creditId]) {
                holdings[creditId].retired += transaction.amount;
            }
        });

        // Calculate current amounts
        Object.values(holdings).forEach(holding => {
            holding.currentAmount = holding.purchased - holding.retired;
        });

        // Filter out fully retired holdings
        const activeHoldings = Object.values(holdings).filter(h => h.currentAmount > 0);

        res.status(200).json({
            success: true,
            data: {
                holdings: activeHoldings,
                summary: {
                    totalCredits: activeHoldings.reduce((sum, h) => sum + h.currentAmount, 0),
                    totalValue: activeHoldings.reduce((sum, h) => sum + h.totalPaid, 0),
                    uniqueCredits: activeHoldings.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get buyer transactions
// @route   GET /api/buyer/transactions
exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20, type } = req.query;
        const userId = req.user._id;
        
        const query = {
            $or: [{ from: userId }, { to: userId }]
        };
        
        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query)
            .populate('credit', 'creditId energyAmountMWh energySource')
            .populate('from to', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                transactions,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get sustainability impact
// @route   GET /api/buyer/sustainability
exports.getSustainabilityImpact = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get all retirement transactions
        const retirements = await Transaction.find({
            from: userId,
            type: 'Retirement',
            status: 'Completed'
        }).populate('credit');

        let totalCO2Offset = 0;
        let totalEnergyEquivalent = 0;
        const byEnergySource = {};
        const monthlyProgress = {};

        retirements.forEach(transaction => {
            const co2Avoided = transaction.credit?.environmentalImpact?.co2Avoided || 0;
            const energyAmount = transaction.credit?.energyAmountMWh || 0;
            const source = transaction.credit?.energySource || 'Unknown';
            const month = new Date(transaction.createdAt).toISOString().slice(0, 7); // YYYY-MM

            totalCO2Offset += co2Avoided * transaction.amount;
            totalEnergyEquivalent += energyAmount * transaction.amount;

            // By energy source
            if (!byEnergySource[source]) {
                byEnergySource[source] = { co2Offset: 0, credits: 0, energy: 0 };
            }
            byEnergySource[source].co2Offset += co2Avoided * transaction.amount;
            byEnergySource[source].credits += transaction.amount;
            byEnergySource[source].energy += energyAmount * transaction.amount;

            // Monthly progress
            if (!monthlyProgress[month]) {
                monthlyProgress[month] = { co2Offset: 0, credits: 0 };
            }
            monthlyProgress[month].co2Offset += co2Avoided * transaction.amount;
            monthlyProgress[month].credits += transaction.amount;
        });

        // Calculate equivalent metrics
        const treesEquivalent = Math.round(totalCO2Offset / 0.02); // Rough estimate: 1 tree = ~0.02 tons CO2/year
        const carMilesOffset = Math.round(totalCO2Offset * 2204.62); // 1 ton CO2 = ~2204.62 car miles

        res.status(200).json({
            success: true,
            data: {
                impact: {
                    totalCO2Offset,
                    totalEnergyEquivalent,
                    treesEquivalent,
                    carMilesOffset
                },
                breakdown: {
                    byEnergySource,
                    monthlyProgress: Object.entries(monthlyProgress)
                        .map(([month, data]) => ({ month, ...data }))
                        .sort((a, b) => a.month.localeCompare(b.month))
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Send purchase request to producer (request system)
// @route   POST /api/buyer/credits/:creditId/purchase
exports.purchaseCredit = async (req, res) => {
    try {
        const { creditId } = req.params;
        const buyerId = req.user._id;

        // Find the credit and check if it can be sold
        const credit = await Credit.findById(creditId).populate('producer', 'name email');
        if (!credit) {
            return res.status(404).json({ 
                success: false, 
                message: 'Credit not found' 
            });
        }

        if (!credit.canBeSold()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Credit is not available for purchase (either already sold or not certified)' 
            });
        }

        // Check if there's already a pending request for this credit from this buyer
        const existingRequest = await Transaction.findOne({
            credit: creditId,
            buyer: buyerId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending purchase request for this credit'
            });
        }

        // Create purchase request (pending status)
        const purchaseRequest = new Transaction({
            credit: creditId,
            buyer: buyerId,
            status: 'pending',
            requestDate: new Date()
        });

        await purchaseRequest.save();

        // Send in-app notification to producer
        console.log(`🔔 Creating notification for producer ${credit.producer._id} about purchase request from buyer ${req.user.name} (${req.user.role})`);
        const notification = await Notification.create({
            user: credit.producer._id,
            title: '🛒 New Purchase Request from Buyer!',
            message: `BUYER "${req.user.name}" (${req.user.role}) wants to purchase your hydrogen credit "${credit.creditId}" - ${credit.energyAmountMWh} MWh from ${credit.facilityName}. Click to approve or reject this request.`,
            type: 'purchase_requested',
            priority: 'high',
            relatedModel: 'Transaction',
            relatedId: purchaseRequest._id,
            actionUrl: `/dashboard/producer/requests`,
            actionText: 'View & Respond',
            metadata: {
                buyerName: req.user.name,
                buyerEmail: req.user.email,
                buyerRole: req.user.role,
                buyerId: req.user._id,
                creditId: credit.creditId,
                energyAmount: credit.energyAmountMWh,
                energyAmountMWh: credit.energyAmountMWh,
                facilityName: credit.facilityName,
                energySource: credit.energySource,
                requestDate: new Date(),
                requestId: purchaseRequest._id,
                transactionId: purchaseRequest._id
            }
        });
        console.log(`✅ Notification created successfully with ID: ${notification._id}`);

        // Send email notification to producer
        console.log(`📧 EMAIL NOTIFICATION TO PRODUCER:`);
        console.log(`To: ${credit.producer.email}`);
        console.log(`Subject: 🛒 New Purchase Request for Your Hydrogen Credit ${credit.creditId}`);
        console.log(`Message: Dear ${credit.producer.name},`);
        console.log(`BUYER "${req.user.name}" (Role: ${req.user.role}) has requested to purchase your hydrogen credit:`);
        console.log(`• Buyer Email: ${req.user.email}`);
        console.log(`• Credit ID: ${credit.creditId}`);
        console.log(`• Energy Amount: ${credit.energyAmountMWh} MWh`);
        console.log(`• Facility: ${credit.facilityName}`);
        console.log(`• Request Date: ${new Date().toLocaleString()}`);
        console.log(`📱 Please log in to your producer dashboard to approve or reject this request.`);
        console.log(`🔗 Dashboard: /dashboard/producer/requests`);
        console.log(`---`);

        console.log(`✅ BUYER CONTROLLER: Purchase request created successfully`);
        console.log(`📊 Transaction ID: ${purchaseRequest._id}`);
        console.log(`👤 Buyer: ${req.user.name} (${req.user._id})`);
        console.log(`🏭 Producer: ${credit.producer.name} (${credit.producer._id})`);
        console.log(`💰 Credit: ${credit.creditId} (${credit.energyAmountMWh} MWh)`);

        res.status(201).json({
            success: true,
            message: 'Purchase request sent to producer! They will receive an email and in-app notification.',
            data: {
                purchaseRequest,
                credit: {
                    creditId: credit.creditId,
                    energyAmountMWh: credit.energyAmountMWh,
                    facilityName: credit.facilityName
                }
            }
        });
    } catch (error) {
        console.error('Error in purchaseCredit:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all notifications for the logged-in buyer
// @route   GET /api/buyer/notifications
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
// @route   PATCH /api/buyer/notifications/:id/read
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
// @route   PATCH /api/buyer/notifications/read-all
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

// @desc    Get wallet data for buyer
// @route   GET /api/buyer/wallet
exports.getWalletData = async (req, res) => {
  try {
    const walletData = require('../../../walletData.json');
    const buyerWallet = walletData.find(wallet => wallet.role === 'Buyer');

    if (!buyerWallet) {
      return res.status(404).json({ success: false, message: 'Buyer wallet not found' });
    }

    res.status(200).json({ success: true, data: buyerWallet });
  } catch (error) {
    console.error('Error fetching buyer wallet data:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};