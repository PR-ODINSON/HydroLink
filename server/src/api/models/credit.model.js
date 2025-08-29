const mongoose = require('mongoose');

const CreditSchema = new mongoose.Schema({
  // The ID of the token on the blockchain, added after minting
  tokenId: {
    type: String,
    default: null,
  },
  // The user who produced the hydrogen
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The user who certified the production
  certifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  productionDate: {
    type: Date,
    required: true,
  },
  energyAmountMWh: { // Example metric
    type: Number,
    required: true,
  },
  proofDocumentUrl: { // Link to IPFS or a cloud storage
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Certified', 'Retired'],
    default: 'Pending',
  },
}, { timestamps: true });

const Credit = mongoose.model('Credit', CreditSchema);
module.exports = Credit;