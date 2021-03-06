const express = require('express');
const router = express.Router();
const path = require('path');
const Blog = require('../models/blog');
const { auth, authRole } = require('../auth/auth');
const User = require('../models/user');
const layout = path.join('layouts', 'index')


router.get('/allblogs', auth, async (req, res) => {
    let user = await User.findById({ _id: req.user });
    const data = {
        title: `${user.firstName}'s blogpost`,
        layout,
        user
    };
    res.render('blogs', data);
});

router.post('/auth/profile/writeblog', auth, async (req, res) => {

    try {
        console.log(req.body);
        const blog = new Blog({
            title: req.body.title,
            description: req.body.description,
            body: req.body.body,
            genre: req.body.genre,
            userId: req.user
        });

        await blog.save();
        console.log(blog)
        const data = {
            title: `Blog saved`,
            layout,
            blog
        };

        res.render('writeblog', data);

    } catch (error) {
        if (error) {
            console.log("Error: ", error.message);
            throw error;
        }
    }
    
});

router.get('/auth/profile/editblog/:id', auth, (req, res) => {
    res.render()
})

router.post('/auth/profile/editblog/:id', auth, (req, res) => {

})

module.exports = router;