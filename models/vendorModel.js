const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  store_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  store_logo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pincode: { type: Number, required: true },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'vendor',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },

  description: {
    type: String,
    required: true,
  },
  country_code: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  country_id: {
    type: Number,
    required: true,
  },
  state_id: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
