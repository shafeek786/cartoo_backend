const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");
const jwtAuth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/productImages");
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

// Define your routes
router.post(
  "/addproduct",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
    { name: "sizeChart", maxCount: 1 },
  ]),
  productController.addProduct
);

router.put(
  "/updateproduct/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
    { name: "sizeChart", maxCount: 1 },
  ]),
  productController.updateProduct
);

// routes for getting products
router.get("", jwtAuth("customer"), productController.getProducts); // Get all products
router.get("/product/:id", productController.getProductById); // Get a product by ID

// routes for admin to block/unblock products
router.put(
  "/toggleApproval/:id",
  jwtAuth,
  productController.toggleProductApproval
);

// Export the router
module.exports = router;
