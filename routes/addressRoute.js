const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const jwtAuth = require('../middleware/auth');

// Route to create a new address
router.post(
  '/create_address',
  jwtAuth('consumer'),
  addressController.createAddress
);

// Route to get all addresses for a user
router.get(
  '/user_addresses',
  jwtAuth('consumer'),
  addressController.getAddressesByUserId
);

// Route to get a specific address by ID
router.get('/address/:id', addressController.getAddressById);

// Route to update an existing address
router.put('/update_address/:id', addressController.updateAddress);

// Route to delete an address
router.delete('/delete_address/:id', addressController.deleteAddress);

module.exports = router;
