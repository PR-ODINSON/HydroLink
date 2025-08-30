const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['Purchase', 'Transfer', 'Retirement', 'Mint', 'Burn'],
    required: true,
    index: true
  },
  credit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credit',
    required: true,
    index: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type !== 'Mint';
    },
    index: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type !== 'Retirement' && this.type !== 'Burn';
    },
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Transaction amount must be at least 0.01']
  },
  pricePerCredit: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    required: function() {
      return this.type === 'Purchase';
    }
  },
  totalValue: {
    type: Number,
    min: [0, 'Total value cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'ETH', 'BTC', 'USDC']
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  blockchain: {
    network: {
      type: String,
      default: 'ethereum'
    },
    txHash: String,
    blockNumber: Number,
    gasUsed: Number,
    gasFee: Number,
    confirmations: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    reason: String, // For retirements
    notes: String,
    externalRef: String, // External system reference
    tags: [String]
  },
  fees: {
    platformFee: {
      type: Number,
      default: 0
    },
    networkFee: {
      type: Number,
      default: 0
    },
    totalFees: {
      type: Number,
      default: 0
    }
  },
  audit: {
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ipAddress: String,
    userAgent: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to generate transaction ID and calculate total value
TransactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now();
    const type = this.type.toUpperCase().substring(0, 3);
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.transactionId = `TXN-${type}-${timestamp}-${random}`;
  }
  
  // Calculate total value for purchases
  if (this.type === 'Purchase' && this.pricePerCredit && this.amount) {
    this.totalValue = this.pricePerCredit * this.amount;
  }
  
  next();
});

// Virtual for transaction age
TransactionSchema.virtual('ageInHours').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60));
});

// Virtual for net value (total value minus fees)
TransactionSchema.virtual('netValue').get(function() {
  return (this.totalValue || 0) - (this.fees.totalFees || 0);
});

// Instance methods
TransactionSchema.methods.complete = function(txHash, blockNumber) {
  this.status = 'Completed';
  this.blockchain.txHash = txHash;
  this.blockchain.blockNumber = blockNumber;
  return this.save();
};

TransactionSchema.methods.fail = function(reason) {
  this.status = 'Failed';
  this.metadata.reason = reason;
  return this.save();
};

TransactionSchema.methods.cancel = function(reason) {
  this.status = 'Cancelled';
  this.metadata.reason = reason;
  return this.save();
};

TransactionSchema.methods.isPending = function() {
  return this.status === 'Pending';
};

TransactionSchema.methods.isCompleted = function() {
  return this.status === 'Completed';
};

// Static methods
TransactionSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { from: userId },
      { to: userId },
      { 'audit.initiatedBy': userId }
    ]
  }).populate('credit from to', 'name email creditId');
};

TransactionSchema.statics.findByCredit = function(creditId) {
  return this.find({ credit: creditId })
    .populate('from to', 'name email')
    .sort({ createdAt: -1 });
};

TransactionSchema.statics.getTransactionStats = async function(userId = null) {
  const matchStage = userId ? {
    $or: [
      { from: mongoose.Types.ObjectId(userId) },
      { to: mongoose.Types.ObjectId(userId) }
    ]
  } : {};

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          type: '$type',
          status: '$status'
        },
        count: { $sum: 1 },
        totalValue: { $sum: '$totalValue' },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.type': 1, '_id.status': 1 } }
  ]);

  const volumeByMonth = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalVolume: { $sum: '$totalValue' },
        transactionCount: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  return {
    transactionStats: stats,
    volumeByMonth: volumeByMonth.reverse()
  };
};

// Indexes
TransactionSchema.index({ transactionId: 1 }, { unique: true });
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ from: 1, createdAt: -1 });
TransactionSchema.index({ to: 1, createdAt: -1 });
TransactionSchema.index({ credit: 1, createdAt: -1 });
TransactionSchema.index({ 'blockchain.txHash': 1 });
TransactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
