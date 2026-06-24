const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");
const logger = require("./logger");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

logger.info(`MONGO_URI env variable exists: ${!!process.env.MONGO_URI}`);
if (process.env.MONGO_URI) {
  logger.info(`MONGO_URI starts with: ${process.env.MONGO_URI.substring(0, 20)}`);
} else {
  logger.warn("MONGO_URI is UNDEFINED!");
}

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes."
  }
});
app.use(limiter);

// Database connection middleware for Serverless environment
const connectDB = async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopez";
    logger.info("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoURI);
    logger.info("MongoDB Connected successfully");
    next();
  } catch (err) {
    logger.error("Database connection error: " + err.message, { error: err });
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
    logger.info(`Server running on port ${port}`);
  });
}

module.exports = app;