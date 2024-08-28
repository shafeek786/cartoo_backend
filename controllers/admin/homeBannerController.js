const HomeBanner = require('../../models/homeBannerModel');
const s3 = require('../../config/s3');
// Create a new home banner
exports.createHomeBanner = async (req, res) => {
  try {
    // Validate the request data
    const { content } = req.body;

    const homeBanner = new HomeBanner({
      content,
      id: 1,
      slug: 'paris',
    });

    await homeBanner.save();

    // Create and save the new home banner

    res
      .status(201)
      .json({ message: 'Home banner created successfully', homeBanner });
  } catch (error) {
    console.error('Error creating home banner:', error);
    res.status(500).json({ message: 'Error creating home banner', error });
  }
};
// Get all home banners

const generateImageUrls = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      generateImageUrls(obj[key]);
    } else if (key === 'image_key' && obj[key]) {
      obj['image_url'] = s3.getSignedUrl('getObject', {
        Bucket: 'cartoo', // replace with your bucket name
        Key: obj[key],
        Expires: 60 * 5, // URL expires in 5 minutes
      });
    }
  });
};

// exports.getAllHomeBanners = async (req, res) => {
//   try {
//     const homeBanners = await HomeBanner.find();

//     if (homeBanners.length > 0) {
//       const lastHomeBanner = homeBanners[homeBanners.length - 1];

//       // Recursively generate signed URLs for all image_key fields
//       generateImageUrls(lastHomeBanner.content);

//       const dataToSend = {
//         id: 1,
//         slug: 'paris',
//         content: lastHomeBanner.content,
//       };

//       res.status(200).json(lastHomeBanner);
//     } else {
//       res.status(404).json({ message: 'No home banners found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching home banners', error });
//   }
// };

exports.getAllHomeBanners = async (req, res) => {
  try {
    const homeBanners = await HomeBanner.find();

    if (homeBanners.length > 0) {
      const lastHomeBanner = homeBanners[homeBanners.length - 1];
      // console.log('before url: ', lastHomeBanner);
      generateImageUrls(lastHomeBanner.content);
      console.log('after url: ', lastHomeBanner);

      const dataToSend = {
        id: 1,
        slug: 'paris',
        content: {
          featured_banners: {
            status: true,
            banners: lastHomeBanner.featured_banners || [],
          },
          home_banner: {
            status: true,
            main_banner: lastHomeBanner.main_banner || {},
            sub_banner_1: lastHomeBanner.sub_banner_1 || {},
            sub_banner_2: lastHomeBanner.sub_banner_2 || {},
          },
          main_content: {
            status: true,
            sidebar: lastHomeBanner.sidebar || {},
            section1_products: lastHomeBanner.section1_products || {},
            section2_categories_list:
              lastHomeBanner.section2_categories_list || {},
            section3_two_column_banners:
              lastHomeBanner.section3_two_column_banners || {},
          },
          news_letter: lastHomeBanner.news_letter,
          products_ids: lastHomeBanner.products_ids || [],
        },
      };
      res.status(200).json(lastHomeBanner);
    } else {
      res.status(404).json({ message: 'No home banners found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching home banners', error });
  }
};

// Get a single home banner by ID
exports.getHomeBannerById = async (req, res) => {
  try {
    const homeBanner = await HomeBanner.findById(req.params.id);
    if (!homeBanner) {
      return res.status(404).json({ message: 'Home banner not found' });
    }
    res.status(200).json(homeBanner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching home banner', error });
  }
};

// Update a home banner by ID
exports.updateHomeBanner = async (req, res) => {
  try {
    const homeBanner = await HomeBanner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!homeBanner) {
      return res.status(404).json({ message: 'Home banner not found' });
    }
    res
      .status(200)
      .json({ message: 'Home banner updated successfully', homeBanner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating home banner', error });
  }
};

// Delete a home banner by ID
exports.deleteHomeBanner = async (req, res) => {
  try {
    const homeBanner = await HomeBanner.findByIdAndDelete(req.params.id);
    if (!homeBanner) {
      return res.status(404).json({ message: 'Home banner not found' });
    }
    res.status(200).json({ message: 'Home banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting home banner', error });
  }
};
