const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, phone, country_code } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const phoneExisting = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (phoneExisting) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      phone,
      country_code,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err); // Log error
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token, refreshToken, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Missing refresh token' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Forbidden: Invalid refresh token' });
      }

      // Generate a new access token
      const payload = { userId: user.userId, role: user.role };
      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // Optionally, generate a new refresh token
      const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
