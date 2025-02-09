const express = require('express');
const router = express.Router();
const user = require('../model/user');
const post = require('../model/post.js')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'scnpassword123';

router.use(express.json());

//signup api
router.post('/post', async (req, res) => {
    try {
        const data = req.body;
        await user(data).save();
        res.status(200).json({ message: "User registered", success: true })

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "unable to register" })


    }
})

//login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const person = await user.findOne({ username });

        if (!person) {
            return res.status(404).json({ message: "User not found" });
        }

        if (person.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: person._id, isAdmin: person.isAdmin || false }, // Include any additional fields you want in the token
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return res.status(200).json({
            message: "Logged in successfully",
            token,
            person,
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
});



router.get('/viewmypro/:id', async (req, res) => {
    console.log(req.params.id);
    let userId = req.params.id;
    try {
        const item = await user.find({ _id: userId });
        res.status(200).json(item)

    } catch (error) {
        console.log(error)

    }
})

// Route to update the stock and create an order
router.post('/place-order', async (req, res) => {
    const { postId, userId, orderNumber } = req.body; // We expect postId, userId, and orderNumber in the request body

    try {
        // Find the product by its ID
        const product = await postModel.findById(postId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if there is enough stock
        if (product.stock < orderNumber) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Update stock and create the order
        product.stock -= orderNumber; // Decrease stock by the order number
        product.orders.push({ userId, orderNumber }); // Add the new order to the orders array

        // Save the updated product to the database
        await product.save();

        res.status(200).json({
            message: 'Order placed successfully!',
            updatedProduct: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;