const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductById,
  getRecommendations,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getProducts);
router.get("/recommendations", getRecommendations);
router.get("/recommendations/:userId", getRecommendations);
router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct
);

module.exports = router;