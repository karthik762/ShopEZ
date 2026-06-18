const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [{ productId, quantity }]
      });
    } else {
      const existing = cart.products.find(
        (item) => item.productId.toString() === productId
      );

      if (existing) {
        existing.quantity += quantity || 1;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({ message: "Cart updated", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId
    }).populate("products.productId");

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId
      );
    }

    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToCart, getCart, removeFromCart };
