const express = require('express');
const router = express.Router();
const homeBannerController = require('../../controllers/admin/homeBannerController');

// Create a new home banner
router.post('/', homeBannerController.createHomeBanner);

// Get all home banners
router.get('/', homeBannerController.getAllHomeBanners);

// Get a single home banner by ID
router.get('/:id', homeBannerController.getHomeBannerById);

// Update a home banner by ID
router.put('/:id', homeBannerController.updateHomeBanner);

// Delete a home banner by ID
router.delete('/:id', homeBannerController.deleteHomeBanner);

module.exports = router;
