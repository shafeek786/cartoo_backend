const Store = require('../models/vendorModel');

exports.createStore = async (req, res) => {
  try {
    const {
      store_name,
      description,
      country_id,
      state_id,
      stateId,
      city,
      address,
      pincode,
      name,
      email,
      phone,
      country_code,
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

    // Create a new store instance
    const newStore = new Store({
      store_name,
      description,
      country_id,
      state_id,
      stateId,
      city,
      address,
      pincode,
      name,
      email,
      phone,
      country_code,
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

exports.getStore = async (req, res) => {
  try {
    const store = await Store.find();
    res.status(200).json({ data: store });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the store ID is passed as a URL parameter
    const updateData = req.body;
    // Update the store in the database
    const updatedStore = await Store.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated fields
    });

    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res
      .status(200)
      .json({ message: 'Store updated successfully', store: updatedStore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
