const Credit = require('../models/credit.model');
const Transaction = require('../models/transaction.model');
const { PortfolioAnalytics } = require('../models/analytics.model');
const { retireCredit, transferCredit, getTokenOwner } = require('../../services/blockchain.service');


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
        
        // Get user's credits (purchases)
        const userTransactions = await Transaction.find({
            $or: [{ to: userId }, { from: userId }],
            status: 'Completed'
        }).populate('credit');

        // Calculate portfolio stats
        let totalCredits = 0;
        let totalSpent = 0;
        let totalRetired = 0;
        let co2Offset = 0;

        userTransactions.forEach(transaction => {
            if (transaction.type === 'Purchase' && transaction.to.equals(userId)) {
                totalCredits += transaction.amount;
                totalSpent += transaction.totalValue || 0;
            }
            if (transaction.type === 'Retirement' && transaction.from.equals(userId)) {
                totalRetired += transaction.amount;
                co2Offset += transaction.credit?.environmentalImpact?.co2Avoided || 0;
            }
        });

        // Get available marketplace credits count
        const marketplaceCount = await Credit.countDocuments({ status: 'Certified' });

        res.status(200).json({
            success: true,
            data: {
                portfolio: {
                    totalCredits: totalCredits - totalRetired,
                    totalSpent,
                    totalRetired,
                    co2Offset
                },
                marketplace: {
                    availableCredits: marketplaceCount
                },
                transactions: {
                    total: userTransactions.length
                }
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

// @desc    Purchase credits
// @route   POST /api/buyer/credits/:creditId/purchase
exports.purchaseCredit = async (req, res) => {
    try {
        const { creditId } = req.params;
        const { amount, pricePerCredit } = req.body;
        const userId = req.user._id;

        const credit = await Credit.findById(creditId);
        if (!credit || credit.status !== 'Certified') {
            return res.status(404).json({ 
                success: false, 
                message: 'Credit not found or not available for purchase' 
            });
        }

        // Create transaction record
        const transaction = new Transaction({
            type: 'Purchase',
            credit: creditId,
            from: credit.currentOwner || credit.producer, // If no current owner, from producer
            to: userId,
            amount: parseFloat(amount),
            pricePerCredit: parseFloat(pricePerCredit),
            status: 'Pending'
        });

        await transaction.save();

        // In a real implementation, you would:
        // 1. Process payment
        // 2. Update blockchain
        // 3. Transfer credit ownership

        // Simulate successful purchase
        transaction.status = 'Completed';
        credit.currentOwner = userId;
        
        await Promise.all([transaction.save(), credit.save()]);

        res.status(200).json({
            success: true,
            message: 'Credit purchased successfully',
            data: { transaction, credit }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};