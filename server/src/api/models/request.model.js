const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  // The user who produced the hydrogen (requester)
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Optionally, the certifier who will process this request
  certifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  // Status of the request
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
    index: true
  },
  // Reason for rejection (if any)
  rejectionReason: {
    type: String,
    default: null
  },
  // All credit request data fields
  productionDate: {
    type: Date,
    required: true
  },
  energyAmountMWh: {
    type: Number,
    required: true
  },
  energySource: {
    type: String,
    enum: ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Other'],
    required: true
  },
  facilityName: {
    type: String,
    required: true
  },
  facilityLocation: {
    type: String,
    required: true
  },
  proofDocumentUrl: {
    type: String,
    required: true
  },
  additionalDocuments: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['Certificate', 'Invoice', 'Report', 'Image', 'Other']
    }
  }],
  // Optionally, notes from the producer
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;
