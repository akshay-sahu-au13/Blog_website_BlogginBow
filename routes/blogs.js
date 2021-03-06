const express = require('express');
const router = express.Router();
const path = require('path');
const Blog = require('../models/blog');
const { auth, authRole } = require('../auth/auth');
const User = require('../models/user');
const layout = path.join('layouts', 'index')


router.get('/auth/profile/userblogs', auth, async (req, res) => {
    const user = await User.findById({_id:req.user});
    try {
        let blogs = await Blog.find({ userId: req.user }).populate(req.user);
        console.log(blogs);
        const data = {
            title: `${user.firstName}'s blogpost`,
            layout,
            blogs
        };
        console.log(data)
        res.render('blogs', {
            title: `${user.firstName}'s blogpost`,
            layout,
            blogs
        });
    } catch (error) {
        console.log(error)
        throw error;
    }

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