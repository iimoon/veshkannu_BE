const express = require('express');
const router = express.Router();
const Cart = require('../model/cart');

// Add or update cart item
router.post('/add-to-cart', async (req, res) => {
  const { userId, postId, quantity } = req.body;
  console.log(req.body)

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart
      cart = new Cart({
        userId,
        items: [{ postId, quantity }],
      });
    } else {
      // Check if the item already exists
      const itemIndex = cart.items.findIndex((item) => item.postId.toString() === postId);

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ postId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

// Get user's cart
router.get('/user-cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.postId');
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve cart' });
  }
});

module.exports = router;
