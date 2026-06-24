const express = require("express");
const router = express.Router();

const { getSettings, updateSettings } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/settings", getSettings);

router.put("/settings", authMiddleware, adminMiddleware, updateSettings);

module.exports = router;
