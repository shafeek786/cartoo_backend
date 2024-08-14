const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const jwtAuth = require('../middleware/auth');

router.get('/get_carts', jwtAuth('consumer'), cartController.getCart);
router.post('/add_to_cart', jwtAuth('consumer'), cartController.addToCart);
router.put(
  '/updat_cart_item',
  jwtAuth('consumer'),
  cartController.updateCartItem
);
router.delete(
  '/remove_from_cart',
  jwtAuth('consumer'),
  cartController.removeItem
);
router.post('/clear_cart', cartController.clearCart);

module.exports = router;
