const express = require("express");
const router = express.Router();

const { createOrder, getUserOrders, getAllOrders,updateOrderStatus } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/create", authMiddleware, createOrder);
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);
router.put("/status/:id", authMiddleware, adminMiddleware, updateOrderStatus);
router.get("/:userId", authMiddleware, getUserOrders);

module.exports = router;