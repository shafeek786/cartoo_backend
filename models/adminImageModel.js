const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const adminImageSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminImage = mongoose.model('AdminImage', adminImageSchema);

module.exports = AdminImage;
