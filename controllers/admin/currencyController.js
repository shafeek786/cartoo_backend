const Currency = require('../../models/currencyModel');

// Create a new currency
exports.createCurrency = async (req, res) => {
  try {
    // Generate a random number for the id field
    const randomId = Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999

    // Merge the randomId with the incoming payload
    const currencyData = {
      id: randomId,
      ...req.body.payload,
    };

    const currency = new Currency(currencyData);
    await currency.save();
    res.status(201).json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all currencies
exports.getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.status(200).json({ data: currencies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single currency by ID
exports.getCurrencyById = async (req, res) => {
  try {
    const currency = await Currency.findById(req.params.id);
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.status(200).json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a currency by ID
exports.updateCurrency = async (req, res) => {
  try {
    const currency = await Currency.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.status(200).json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a currency by ID
exports.deleteCurrency = async (req, res) => {
  try {
    const currency = await Currency.findByIdAndDelete(req.params.id);
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.status(200).json({ message: 'Currency deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
