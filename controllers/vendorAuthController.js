const Vendor = require('../models/vendorModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      storeName,
      storeDescription,
      phone,
      country,
      country_code,
    } = req.body;

    console.log(email);
    // Check for existing user with the same email
    const existingUser = await Vendor.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registeredd' });
    }

    // Check for existing vendor with the same phone number if it's unique
    const existingPhone = await Vendor.findOne({ phone });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: 'Phone number is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new vendor
    const vendor = new Vendor({
      name,
      email,
      password: hashedPassword,
      storeName,
      storeDescription,
      phone,
      country,
      country_code,
    });

    // Save the new vendor to the database
    await vendor.save();

    // Send success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      console.log('password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: vendor._id, role: vendor.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );
    console.log(token);
    res.json({ token, userId: vendor._id, role: vendor.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
