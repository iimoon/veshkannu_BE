const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createAt: {
        type: Date,
        default: new Date()
    },
    orders: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId, // References the User model
                ref: 'user', // Adjust to the correct model name for users
                // required: true
            },
            orderNumber: {
                type: String,
                // required: true
            }
        }
    ],
    stock: {
        type: Number,
        required: true
    }
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
