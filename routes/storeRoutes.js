const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.post('/', storeController.createStore);
router.get('/', storeController.getStore);
router.put('/:id', storeController.updateStore);

module.exports = router;
