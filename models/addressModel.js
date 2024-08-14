const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  title: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state_id: { type: String, required: true },
  country_id: { type: String, required: true },
  pincode: { type: String, required: true },
  country_code: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Address', AddressSchema);
