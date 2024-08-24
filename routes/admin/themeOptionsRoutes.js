// routes/themeOptionsRoutes.js
const express = require('express');
const router = express.Router();
const themeOptionsController = require('../../controllers/admin/themeOptionsController');

// Route to create a new theme option
router.post('/', themeOptionsController.createThemeOption);

// Route to get all theme options
router.get('/', themeOptionsController.getLastThemeOption);

// Route to get a single theme option by ID
router.get('/:id', themeOptionsController.getThemeOptionById);

// Route to update a theme option by ID
router.put('/:id', themeOptionsController.updateThemeOptionById);

// Route to delete a theme option by ID
router.delete('/:id', themeOptionsController.deleteThemeOptionById);

module.exports = router;
