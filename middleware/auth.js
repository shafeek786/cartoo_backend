const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Load secret key securely (e.g., from environment variables)
const secretKey = process.env.JWT_SECRET || 'default_secret'; // Use your secret key

// Middleware function for JWT-based authentication with multiple role checking
const verifyToken = (requiredRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;

      // Check if the user has one of the required roles
      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to access this resource',
        });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      res.status(403).json({
        message: 'Forbidden: Invalid or expired token',
      });
    }
  };
};

module.exports = verifyToken;
