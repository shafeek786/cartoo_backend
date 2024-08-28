const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/admin/settingsController');

// Route to get settings
router.get('/', settingsController.getSettings);
router.get('/back_end', settingsController.getBackendSettings);

// Route to add or update settings
router.post('/', settingsController.addOrUpdateSettings);

module.exports = router;
