const express = require('express');
const router = express.Router();
const post = require('../model/post');
const postModel = require('../model/post');


router.use(express.json())

router.post('/addblog', async (req, res) => {
    const { title, post, image, price, stock } = req.body;

    // Check for empty fields
    if (!title || !post || !image || !price || !stock) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newBlog = new postModel({ title, post, image, price, stock });
        const savedBlog = await newBlog.save();
        res.status(200).json({ message: "Menu added successfully", blog: savedBlog });
    } catch (error) {
        console.error("Error adding menu:", error);
        res.status(500).json({ message: "Unable to add menu" });
    }
});


// to view all blog
router.get('/viewall', async (req, res) => {
    try {
        const data = await post.find();
        res.status(200).json(data)

    } catch (error) {
        console.log(error)

    }
})

//
router.delete('/remove/:id', async (req, res) => {
    try {
        const data = await postModel.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Menu deleted" })

    } catch (error) {
        res.status(404).send({ message: "Menu not found" });

    }

})


router.put('/edit/:id', async (req, res) => {
    try {
        var userid = req.params.id;
        var item = req.body;
        const data = await postModel.findByIdAndUpdate(userid, item);
        if (!data) {
            return res.status(404).send({ message: "Menu not found" });
        }
        res.status(200).send({ message: "Menu updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
});





module.exports = router;




