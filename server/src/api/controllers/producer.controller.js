const Credit = require('../models/credit.model');

// @desc    Request minting for a new credit
// @route   POST /api/producer/credits
exports.requestCreditMinting = async (req, res) => {
  const { productionDate, energyAmountMWh, proofDocumentUrl } = req.body;
  
  try {
    const newCredit = new Credit({
      producer: req.user._id, // from auth middleware
      productionDate,
      energyAmountMWh,
      proofDocumentUrl,
      status: 'Pending',
    });

    const savedCredit = await newCredit.save();
    res.status(201).json({ success: true, data: savedCredit });
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