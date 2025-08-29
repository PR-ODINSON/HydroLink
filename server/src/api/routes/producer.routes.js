const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { requestCreditMinting, getProducerCredits } = require('../controllers/producer.controller');

const router = express.Router();

// All routes here are protected and require a logged-in user
router.use(protect);

// Only users with the 'Producer' role can access these routes
router.use(authorize('Producer'));

router.route('/credits')
    .post(requestCreditMinting)
    .get(getProducerCredits);

module.exports = router;