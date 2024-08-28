const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, ''))); // Connect Database
connectDB();

// Init Middleware
app.use(express.json());
//cors configuration

app.use(
  cors({
    origin: ['http://localhost:4200', 'http://localhost:59073'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  })
);

// Define Routes
app.use('/api/userAuth', require('./routes/userAuthRoutes'));
app.use('/api/vendorAuth', require('./routes/vendorAuth'));
app.use('/api/admin_auth', require('./routes/adminAuth'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('api/admin_auth', require('./routes/adminAuth'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/category', require('./routes/categoryRoutes'));
app.use('/api/store', require('./routes/storeRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/address', require('./routes/addressRoute'));
app.use('/api/admin_images', require('./routes/adminImageRoute'));
app.use('/api/admin_banner', require('./routes/admin/bannerRoutes'));
app.use('/api/theme_options', require('./routes/admin/themeOptionsRoutes'));
app.use('/api/settings', require('./routes/settingsRoute'));
app.use('/api/currencies', require('./routes/currencyRoutes'));
app.use('/api/admin_order', require('./routes/admin/orderRoutes'));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
