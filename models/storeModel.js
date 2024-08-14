const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  countryId: {
    type: String,
    required: true,
  },
  stateId: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    default: '91',
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirmation: {
    type: String,
    required: true,
  },
  storeLogoId: {
    type: String,
  },
  hideVendorEmail: {
    type: Boolean,
    default: false,
  },
  hideVendorPhone: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Number,
    default: 1,
  },
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  pinterest: {
    type: String,
  },
  youtube: {
    type: String,
  },
  twitter: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
