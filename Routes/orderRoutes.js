const express = require('express');
const router = express.Router();
const Order = require('../model/order');
const Post = require('../model/post');

router.post('/create-order', async (req, res) => {
  try {
    const { userId, items } = req.body;
    console.log(req.body);

    // Calculate total amount
    let totalAmount = 0;
    for (let item of items) {
      const post = await Post.findById(item.postId);
      totalAmount += post.price * item.quantity;

      // Check stock availability
      if (post.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${post.title}` });
      }

      // Reduce stock
      post.stock -= item.quantity;
      await post.save();
    }

    // Create order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Order creation failed' });
  }
});

router.get('/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Sort by latest orders
      .populate('items.postId', 'title'); // Populate only the 'title' from Post

    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});


module.exports = router;
