const Settings = require('../../models/settingsModel');
const s3 = require('../../config/s3');
const Currency = require('../../models/currencyModel');

const generateImageUrls = obj => {
  const result = { ...obj }; // Create a copy of the object to avoid mutating the original

  Object.keys(result).forEach(key => {
    if (
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      // Recursively process nested objects
      result[key] = generateImageUrls(result[key]);
    } else if (
      key === 'dark_logo_image_id' ||
      key === 'favicon_image_id' ||
      key === 'light_logo_image_id' ||
      key === 'tiny_logo_image_id'
    ) {
      if (result[key]) {
        // Generate the image URL
        const imageUrl = s3.getSignedUrl('getObject', {
          Bucket: 'cartoo', // replace with your bucket name
          Key: result[key],
          Expires: 60 * 5, // URL expires in 5 minutes
        });

        // Add new field with original image key and generated image URL
        const newKey = key.endsWith('_id') ? key.slice(0, -3) : key; // Removes '_id'
        result[newKey] = {
          original_url: result[key],
          image_url: imageUrl,
        };
        // Remove the original '_id' field
        delete result[key];
      }
    }
  });

  return result;
};
// Get all settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Generate signed URLs for image keys
    // generateImageUrls(settings.toObject());

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getBackendSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    const settingsValues = settings.values.toObject(); // Convert Mongoose document to plain JS object

    // Generate signed URLs and additional image objects
    if (settingsValues.general) {
      settingsValues.general = generateImageUrls(settingsValues.general);
    }

    if (settingsValues.maintenance) {
      settingsValues.maintenance = generateImageUrls(
        settingsValues.maintenance
      );
    }
    // Return only the `values` object with updated image information
    res.status(200).json({ values: settingsValues });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add or update settings

exports.addOrUpdateSettings = async (req, res) => {
  try {
    const settingsData = req.body.payload; // This should include the 'values' field

    // Retrieve default currency details if an ID is provided
    let defaultCurrency = null;
    if (
      settingsData.values.general &&
      settingsData.values.general.default_currency_id
    ) {
      const currencyId = settingsData.values.general.default_currency_id;
      defaultCurrency = await Currency.findOne({ id: currencyId });

      if (!defaultCurrency) {
        return res.status(404).json({ message: 'Currency not found' });
      }
    }

    // Prepare the updated settings with currency details
    const updatedSettings = { ...settingsData.values };

    if (defaultCurrency) {
      updatedSettings.general = {
        ...updatedSettings.general,
        default_currency: {
          id: defaultCurrency.id,
          code: defaultCurrency.code,
          symbol: defaultCurrency.symbol,
          no_of_decimal: defaultCurrency.no_of_decimal,
          exchange_rate: defaultCurrency.exchange_rate,
          symbol_position: defaultCurrency.symbol_position,
          thousands_separator: defaultCurrency.thousands_separator,
          decimal_separator: defaultCurrency.decimal_separator,
          system_reserve: defaultCurrency.system_reserve,
          status: defaultCurrency.status,
          created_by_id: defaultCurrency.created_by_id,
          created_at: defaultCurrency.created_at,
          updated_at: defaultCurrency.updated_at,
          deleted_at: defaultCurrency.deleted_at,
        },
      };
    } else {
      // Handle case where default_currency_id is provided but currency not found
      if (
        settingsData.values.general &&
        settingsData.values.general.default_currency_id
      ) {
        updatedSettings.general.default_currency = null; // Or set to placeholder value if necessary
      }
    }

    // Find if settings already exist
    let settings = await Settings.findOne();

    if (settings) {
      // Update existing settings with new data
      settings.values = {
        ...settings.values, // Preserve existing values
        ...updatedSettings, // Update with new data
      };

      await settings.save(); // Save the updated settings

      const settingsValues = settings.values.toObject(); // Convert Mongoose document to plain JS object

      // Generate signed URLs and additional image objects for updated settings
      if (settingsValues.general) {
        settingsValues.general = generateImageUrls(settingsValues.general);
      }

      return res.status(200).json({
        message: 'Settings updated successfully',
        values: settingsValues,
      });
    } else {
      // Create new settings with all data, including default_currency
      const newSettings = new Settings({ values: updatedSettings });
      await newSettings.save();

      const settingsValues = newSettings.values.toObject(); // Convert Mongoose document to plain JS object

      // Generate signed URLs and additional image objects for new settings
      if (settingsValues.general) {
        settingsValues.general = generateImageUrls(settingsValues.general);
      }

      return res.status(201).json({
        message: 'Settings created successfully',
        values: settingsValues,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
