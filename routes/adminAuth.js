const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminAuthController');

// Define your routes
router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Export the router
module.exports = router;
