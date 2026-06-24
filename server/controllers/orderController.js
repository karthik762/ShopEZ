const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, shippingAddress, clearCart } = req.body;

    // Verify stock for all products in the order first
    for (const item of products) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product not found` });
      }
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${dbProduct.name}. Only ${dbProduct.stock} left.` });
      }
    }

    // Decrement stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = await Order.create({
      userId,
      products,
      totalAmount,
      shippingAddress,
    });

    // clear the user's cart once order is placed, unless clearCart is false
    if (clearCart !== false) {
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { products: [] } }
      );
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.productId")
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: "Order Status Updated",
      order
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};  

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };