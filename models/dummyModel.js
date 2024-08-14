const mongoose = require('mongoose');

const dummySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const Dummy = mongoose.model('Dummy', dummySchema);

module.exports = Dummy;
