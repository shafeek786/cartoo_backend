const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const jwtAuth = require('../middleware/auth');
const imageController = require('../controllers/imageController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/productImages');
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

// Define your routes
router.post(
  '/addproduct',
  upload.fields([
    { name: 'product_thumbnail', maxCount: 1 },
    { name: 'productImage', maxCount: 1 },
    { name: 'sizeChart', maxCount: 1 },
  ]),
  productController.addProduct
);

router.post(
  '/addproducts',
  upload.fields([
    { name: 'product_thumbnail', maxCount: 1 },
    { name: 'productImage', maxCount: 1 },
    { name: 'sizeChart', maxCount: 1 },
  ]),
  productController.addProduct
);

router.put(
  '/updateproduct/:id',
  upload.fields([
    { name: 'product_thumbnail', maxCount: 1 },
    { name: 'productImage', maxCount: 1 },
    { name: 'sizeChart', maxCount: 1 },
  ]),
  productController.updateProduct
);

// routes for getting products
router.get('', productController.getProducts); // Get all products
router.get('/product/:slug', productController.getProductBySlug);

// routes for admin to block/unblock products
router.put(
  '/toggleApproval/:id',
  jwtAuth,
  productController.toggleProductApproval
);

// router.post(
//   '/addimage',
//   upload.fields([{ name: 'product_thumbnail', maxCount: 1 }]),
//   imageController.addImage
// );

router.post(
  '/addimage',
  jwtAuth('vendor'),
  upload.array('product_thumbnail', 5),
  imageController.addImage
);

router.get('/getImage', jwtAuth('vendor'), imageController.getImage);
// Export the router
module.exports = router;
