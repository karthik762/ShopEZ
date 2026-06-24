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

const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all active products in stock
    const products = await Product.find({ stock: { $gt: 0 } });
    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    if (userId) {
      // Fetch user's orders and populate products info
      const userOrders = await Order.find({ userId }).populate("products.productId");

      if (userOrders && userOrders.length > 0) {
        // Find highest amount order
        let highestOrder = userOrders[0];
        userOrders.forEach((o) => {
          if (o.totalAmount > highestOrder.totalAmount) {
            highestOrder = o;
          }
        });

        // Determine categories in highest order
        const categoriesInHighestOrder = new Set();
        highestOrder.products.forEach((item) => {
          if (item.productId && item.productId.category) {
            const cat = item.productId.category;
            if (Array.isArray(cat)) {
              cat.forEach(c => categoriesInHighestOrder.add(c));
            } else {
              categoriesInHighestOrder.add(cat);
            }
          }
        });

        // Count categories and products across all orders to identify favorites
        const categoryCounts = {};
        const productCounts = {};

        userOrders.forEach((order) => {
          order.products.forEach((item) => {
            if (item.productId) {
              const cat = item.productId.category;
              const prodId = item.productId._id.toString();

              if (cat) {
                if (Array.isArray(cat)) {
                  cat.forEach(c => {
                    categoryCounts[c] = (categoryCounts[c] || 0) + item.quantity;
                  });
                } else {
                  categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
                }
              }
              productCounts[prodId] = (productCounts[prodId] || 0) + item.quantity;
            }
          });
        });

        let favoriteCategory = null;
        let maxCatCount = 0;
        Object.keys(categoryCounts).forEach((cat) => {
          if (categoryCounts[cat] > maxCatCount) {
            maxCatCount = categoryCounts[cat];
            favoriteCategory = cat;
          }
        });

        let favoriteProductId = null;
        let maxProdCount = 0;
        Object.keys(productCounts).forEach((prodId) => {
          if (productCounts[prodId] > maxProdCount) {
            maxProdCount = productCounts[prodId];
            favoriteProductId = prodId;
          }
        });

        let recs = [];

        // 1. Add favorite product if in stock
        if (favoriteProductId) {
          const favProduct = products.find((p) => p._id.toString() === favoriteProductId);
          if (favProduct) {
            recs.push({ product: favProduct, reason: "Your Most Ordered Item" });
          }
        }

        // 2. Add products matching preferred categories (from highest order or favorite category)
        const preferredCategories = new Set(categoriesInHighestOrder);
        if (favoriteCategory) preferredCategories.add(favoriteCategory);

        const categoryProducts = products.filter((p) => {
          if (!p.category) return false;
          const pCats = Array.isArray(p.category) ? p.category : [p.category];
          const matchesCategory = pCats.some(c => preferredCategories.has(c));
          return matchesCategory && p._id.toString() !== favoriteProductId;
        });

        // Sort by newer first
        categoryProducts.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));

        categoryProducts.forEach((p) => {
          if (!p.category) return;
          const pCats = Array.isArray(p.category) ? p.category : [p.category];
          const matchedHighestOrderCat = pCats.find(c => categoriesInHighestOrder.has(c));
          const matchedFavCat = pCats.find(c => c === favoriteCategory);
          const displayCat = matchedHighestOrderCat || matchedFavCat || pCats[0];

          const reason = matchedHighestOrderCat
            ? `Based on highest order (${displayCat})`
            : `Matches favorite category (${displayCat})`;
          recs.push({ product: p, reason });
        });

        // Remove duplicates
        const uniqueRecs = [];
        const seenIds = new Set();
        recs.forEach((r) => {
          const id = r.product._id.toString();
          if (!seenIds.has(id)) {
            seenIds.add(id);
            uniqueRecs.push(r);
          }
        });

        if (uniqueRecs.length > 0) {
          return res.status(200).json(uniqueRecs.slice(0, 3));
        }
      }
    }

    // Default Fallback: return 3 newest arrivals
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
    });

    const fallbackRecs = sortedProducts.slice(0, 3).map((p) => ({
      product: p,
      reason: "New Arrival"
    }));

    return res.status(200).json(fallbackRecs);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getRecommendations,
};
