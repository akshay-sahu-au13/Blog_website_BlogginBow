const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const {auth, authRole }= require('../auth/auth');
const User = require('../models/user');


router.get('/allblogs', auth, async(req, res)=> {
    let user = await User.findById({_id:req.user});
    data = {
        title: `${user.firstName}'s blogpost`,
        layout,
        user
    };
    res.render('blogs', data);
});

router.post('/auth/profile/writeblog', auth, async(req, res)=> {

    const blog = new Blog({
        title: req.body.title,
        description: req.body.description,
        body: req.body.body,
        genre: req.body.genre
    });

    await blog.save();
    
    const data = {
        title: `Blog saved`,
        layout,
        blog
    };

    res.render('writeblog', data);

});

router.get('/auth/profile/editblog/:id', auth, (req, res)=> {
    res.render()
})

router.post('/auth/profile/editblog/:id', auth, (req, res)=> {

})

module.exports = router;