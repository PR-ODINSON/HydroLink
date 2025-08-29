const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const handleValidationErrors = require('../middlewares/validator.middleware');

const router = express.Router();

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['Producer', 'Certifier', 'Buyer']),
    handleValidationErrors
], registerUser);

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    handleValidationErrors
], loginUser);

module.exports = router;