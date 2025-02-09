const express = require('express');
const router = express.Router();
const admin = require('../model/admin');
const Order = require("../model/order");
const jwt = require('jsonwebtoken');

const JWT_SECRET = "passwordtharula"; 

router.use(express.json());


router.post('/adminlogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const person = await admin.findOne({ username });

        if (!person) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (person.password === password) {
            // Generate JWT token
            const token = jwt.sign(
                { userId: person._id, username: person.username, isAdmin: true },  // Set isAdmin flag
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                message: "Logged in successfully",
                token,  // Return the token to the frontend
                user: {
                    id: person._id,
                    username: person.username,
                },
            });
        } else {
            return res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "An error occurred during admin login" });
    }
});

router.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email class college').populate('items.postId', 'title price');  // Fetch order with user info and post title/price
        res.status(200).json(orders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// PATCH update order status (approve or cancel)
router.patch('/admin/orders/:orderId', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Allowed values: approved, cancelled.' });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: `Order ${status} successfully`, order });
    } catch (error) {
        console.error('Failed to update order status:', error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
});

router.get("/admin/summary", async (req, res) => {
    try {
        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const approvedOrders = await Order.countDocuments({ status: "approved" });
        const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

        const totalEarned = await Order.aggregate([
            { $match: { status: "approved" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const monthlyOrdersData = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    orders: { $sum: 1 },
                },
            },
            {
                $project: {
                    month: "$_id",
                    orders: 1,
                    _id: 0,
                },
            },
            { $sort: { month: 1 } },
        ]);

        // Generate an array of all months with default value 0 for orders
        const allMonths = Array.from({ length: 12 }, (_, i) => ({
            month: getMonthName(i + 1),
            orders: 0,
        }));

        // Merge the monthlyOrdersData with allMonths
        const monthlyOrders = allMonths.map((month) => {
            const found = monthlyOrdersData.find((data) => data.month === allMonths.indexOf(month) + 1);
            return {
                month: month.month,
                orders: found ? found.orders : 0,
            };
        });

        res.status(200).json({
            summary: {
                pendingOrders,
                approvedOrders,
                cancelledOrders,
                totalEarned: totalEarned[0]?.total || 0,
            },
            monthlyOrders,
        });
    } catch (error) {
        console.error("Error fetching admin summary:", error);
        res.status(500).json({ message: "Failed to fetch admin summary" });
    }
});

function getMonthName(month) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    return monthNames[month - 1];
}

module.exports = router;