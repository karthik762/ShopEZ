const Admin = require("../models/Admin");

// Get admin settings (banner, categories)
const getSettings = async (req, res) => {
  try {
    let settings = await Admin.findOne();

    // If no settings exist yet, create a default settings document
    if (!settings) {
      settings = await Admin.create({
        banner: "Welcome to ShopEZ! Explore our latest collections.",
        categories: ["Electronics", "Fashion", "Sports", "Books"]
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update admin settings
const updateSettings = async (req, res) => {
  try {
    const { banner, categories } = req.body;

    // Find first settings document and update it, or create if it doesn't exist
    const settings = await Admin.findOneAndUpdate(
      {},
      { banner, categories },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Admin settings updated successfully",
      settings
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
