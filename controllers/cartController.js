const Cart = require("../models/Cart");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

module.exports = {
  addToCart: catchAsyncErrors(async (req, res) => {
    const { userId, cartItem, quantity } = req.body;

    try {
      const cart = await Cart.findOne({ userId });

      if (cart) {
        const existingProduct = await cart.products.find((product) =>
          product.cartItem.equals(cartItem)
        );

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.products.push({ cartItem, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Product added in cart successfully" });
      } else {
        const newCart = new Cart({
          userId,
          products: [{ cartItem, quantity }],
        });
        await newCart.save();
        res.status(200).json({ message: "Product added in cart successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),

  getCart: catchAsyncErrors(async (req, res) => {
    const userId = req.params.id;

    try {
      const cart = await Cart.find({ userId }).populate(
        "products.cartItem",
        "_id title supplier price imageUrl"
      );

      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),

  deleteCartItem: catchAsyncErrors(async (req, res) => {
    const { userId, cartItem } = req.body;
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
      }

      const deleteCart = cart.products.filter(
        (item) => !item.cartItem.equals(cartItem) // .equals is used to compare mondodb ObjectId
      );

      cart.products = deleteCart;
      await cart.save();

      res.status(200).json(cart.products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }),

  decrementCartItem: catchAsyncErrors(async (req, res) => {
    const { userId, cartItem } = req.body;

    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
      }
      const existingProduct = cart.products.find((product) =>
        product.cartItem.equals(cartItem)
      );

      if (!existingProduct) {
        res.status(404).json({ message: "Product not found" });
      }

      if (existingProduct.quantity === 1) {
        cart.products = cart.products.filter(
          (product) => !product.cartItem.equals(cartItem)
        );
      } else {
        existingProduct.quantity -= 1;
      }

      await cart.save();

      if (existingProduct.quantity === 0) {
        await Cart.updateOne({ userId }, { $pull: { products: { cartItem } } });
      }

      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),
};
