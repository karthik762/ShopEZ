const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

console.log("DEBUG: MONGO_URI env variable exists:", !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
  console.log("DEBUG: MONGO_URI starts with:", process.env.MONGO_URI.substring(0, 20));
} else {
  console.log("DEBUG: MONGO_URI is UNDEFINED!");
}

const app = express();

app.use(cors());
app.use(express.json());

// Database connection middleware for Serverless environment
const connectDB = async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopez";
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected successfully");
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({
      message: "Database connection failed",
      error: err.message
    });
  }
};

app.use(connectDB);

app.get("/", (req, res) => {
  res.json({
    message: "ShopEZ API Running Successfully"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5005;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;