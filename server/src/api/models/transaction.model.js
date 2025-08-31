const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // The credit being sold
  credit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credit',
    required: [true, 'Credit is required'],
    index: true
  },
  // The buyer purchasing the credit
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer is required'],
    index: true
  },
  // Request status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
    index: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  responseDate: {
    type: Date
  },
  completedDate: {
    type: Date
  }
}, { 
  timestamps: true
});

// Static methods
TransactionSchema.statics.findByBuyer = function(buyerId) {
  return this.find({ buyer: buyerId })
    .populate('credit', 'creditId energyAmountMWh facilityName energySource productionDate producer certifier')
    .populate({
      path: 'credit',
      populate: {
        path: 'producer',
        select: 'name email'
      }
    })
    .sort({ createdAt: -1 });
};

TransactionSchema.statics.findCompletedByBuyer = function(buyerId) {
  return this.find({ buyer: buyerId, status: 'completed' })
    .populate('credit', 'creditId energyAmountMWh facilityName energySource productionDate producer certifier')
    .populate({
      path: 'credit',
      populate: {
        path: 'producer',
        select: 'name email'
      }
    })
    .sort({ createdAt: -1 });
};

TransactionSchema.statics.findByCredit = function(creditId) {
  return this.find({ credit: creditId })
    .populate('buyer', 'name email role walletAddress')
    .sort({ createdAt: -1 });
};

TransactionSchema.statics.findPendingForProducer = function(producerId) {
  return this.find({ status: 'pending' })
    .populate({
      path: 'credit',
      match: { producer: producerId },
      select: 'creditId energyAmountMWh facilityName energySource producer'
    })
    .populate('buyer', 'name email role walletAddress')
    .then(transactions => transactions.filter(t => t.credit !== null))
    .sort({ createdAt: -1 });
};

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;