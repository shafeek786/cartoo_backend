const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Load secret key securely (e.g., from environment variables)
const secretKey = process.env.JWT_SECRET || 'default_secret'; // Use your secret key

// Middleware function for JWT-based authentication with role checking
const verifyToken = requiredRole => {
  return (req, res, next) => {
    console.log('Middleware activated');
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('error');
      return res
        .status(401)
        .json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    try {
      console.log('Secret Key:', secretKey);
      const decoded = jwt.verify(token, secretKey);
      console.log('Decoded Token:', decoded);
      req.user = decoded;

      // Check if the user has the required role
      if (requiredRole && req.user.role !== requiredRole) {
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
