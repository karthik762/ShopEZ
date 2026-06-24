const Product = require("../models/Product");
const Order = require("../models/Order");

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product Added",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    let recommendedProducts = [];

    if (userId && userId !== "undefined" && userId !== "null") {
      const orders = await Order.find({ userId }).populate("products.productId");
      const purchasedCategories = new Set();
      orders.forEach(order => {
        if (order.products) {
          order.products.forEach(p => {
            if (p.productId && p.productId.category) {
              purchasedCategories.add(p.productId.category);
            }
          });
        }
      });

      if (purchasedCategories.size > 0) {
        recommendedProducts = await Product.find({
          category: { $in: Array.from(purchasedCategories) }
        }).limit(8);
      }
    }

    if (recommendedProducts.length < 4) {
      const excludedIds = recommendedProducts.map(p => p._id);
      const fallbackProducts = await Product.find({
        _id: { $nin: excludedIds }
      }).limit(8 - recommendedProducts.length);
      recommendedProducts = recommendedProducts.concat(fallbackProducts);
    }

    res.status(200).json(recommendedProducts);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Product Deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const updateProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.status(200).json({
      message: "Product Updated",
      product,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  getRecommendations,
  deleteProduct,
  updateProduct,
};
