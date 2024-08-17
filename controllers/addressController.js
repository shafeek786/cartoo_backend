const Address = require('../models/addressModel');
const User = require('../models/userModel');
// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(req.body);

    // Create and save the new address
    const address = new Address({ ...req.body, user: userId });
    await address.save();

    // Fetch the user details for additional info if needed
    const user = await User.findById(userId);
    const addresses = await Address.find({ user: userId });
    // Format the response to match getAddressById
    const response = {
      id: user._id,
      name: user.name,
      email: user.email,
      country_code: user.country_code,
      phone: user.phone,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      profile_image: user.profile_image, // assuming you have a profile_image field
      addresses: addresses, // array of addresses
      orders_count: user.orders_count, // additional fields
      payment_account: user.payment_account,
      point: user.point,
      role: user.role,
      status: user.status,
      wallet: user.wallet,
      vendor_wallet: user.vendor_wallet,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all addresses for a specific user

exports.getAddressesByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch the user details
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Fetch the user's addresses
    const addresses = await Address.find({ user: userId });

    // Format the response
    const response = {
      id: user._id,
      name: user.name,
      email: user.email,
      country_code: user.country_code,
      phone: user.phone,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      profile_image: user.profile_image, // assuming you have a profile_image field
      addresses: addresses, // array of addresses
      orders_count: user.orders_count, // additional fields
      payment_account: user.payment_account,
      point: user.point,
      role: user.role,
      status: user.status,
      wallet: user.wallet,
      vendor_wallet: user.vendor_wallet,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a specific address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }
    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update an existing address
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }
    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
