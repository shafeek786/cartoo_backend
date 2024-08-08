const Vendor = require("../models/vendorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log(email);
    const existingUser = await Vendor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const vendor = new Vendor({
      name,
      email,
      password: hashedPassword,
    });

    await vendor.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err); // Log error
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: vendor._id, role: vendor.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, userId: vendor._id, role: vendor.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
