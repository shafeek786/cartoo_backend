const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.post('/create_store', storeController.createStore);

module.exports = router;
