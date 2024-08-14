const Store = require('../models/storeModel');

exports.createStore = async (req, res) => {
  try {
    const {
      storeName,
      description,
      countryId,
      stateId,
      city,
      address,
      pincode,
      name,
      email,
      phone,
      countryCode = '91',
      password,
      passwordConfirmation,
      storeLogoId,
      hideVendorEmail = 0,
      hideVendorPhone = 0,
      status = 1,
      facebook,
      instagram,
      pinterest,
      youtube,
      twitter,
    } = req.body;

    // Validate password confirmation
    if (password !== passwordConfirmation) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Create a new store instance
    const newStore = new Store({
      storeName,
      description,
      countryId,
      stateId,
      city,
      address,
      pincode,
      name,
      email,
      phone,
      countryCode,
      password, // Consider hashing the password before saving
      passwordConfirmation,
      storeLogoId,
      hideVendorEmail: Boolean(hideVendorEmail),
      hideVendorPhone: Boolean(hideVendorPhone),
      status,
      facebook,
      instagram,
      pinterest,
      youtube,
      twitter,
    });

    // Save the store to the database
    await newStore.save();

    res
      .status(201)
      .json({ message: 'Store created successfully', store: newStore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
