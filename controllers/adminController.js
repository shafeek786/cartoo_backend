const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');

// Update user approval status
exports.updateUserApproval = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isApproved } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = isApproved;
    await user.save();

    res.status(200).json({ message: 'User approval status updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update vendor approval status
exports.updateVendorApproval = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { isApproved } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.isApproved = isApproved;
    await vendor.save();

    res.status(200).json({ message: 'Vendor approval status updated', vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingEmail = await Vendor.findOne({ email: email });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const vendor = new Vendor({ name, email, password, role });
    await vendor.save();

    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await Vendor.findByIdAndDelete(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit user details
exports.editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user details
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log('check user');
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    res.status(200).json({ vendors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
