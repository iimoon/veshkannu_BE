const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
    },
  ],
});

const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;
