const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  code: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  exchange_rate: {
    type: Number,
    required: true,
  },
  no_of_decimal: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  symbol_position: {
    type: String,
    default: 'before_price',
  },
  created_by_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  system_reserve: { type: Number, default: 1 },

  decimal_separator: { type: String, default: 'comma' },
  thousands_separator: { type: String, default: 'comma' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
