const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  items: [
    {
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;
