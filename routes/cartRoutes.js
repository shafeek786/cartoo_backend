const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/get_carts', cartController.getCart);
router.post('/add_to_cart', cartController.addToCart);
router.put('/updat_cart_item', cartController.updateCartItem);
router.delete('/remove_from_cart', cartController.removeItem);
router.post('/clear_cart', cartController.clearCart);

module.exports = router;
