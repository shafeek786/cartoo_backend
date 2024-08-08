const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use("/api/userAuth", require("./routes/userAuthRoutes"));
app.use("/api/vendorAuth", require("./routes/vendorAuth"));
app.use("/api/adminAuth", require("./routes/adminAuth"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
