const express = require('express');
const router = express.Router();
const path = require("path");
const config = require('../config/config');
const User = require('../models/user');
const Profile = require('../models/profile_info');
const bcrypt = require('bcryptjs');
const { auth, authRole } = require('../auth/auth');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const { userInfo } = require('os');
const { request } = require('http');
const loggedUsers = {};
const layout = path.join('layouts', 'index');
const multer = require('multer');

const Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

// Init file upload

let upload = multer({
    storage: Storage,
}).single('dp');


// -------GET SIGNUP---------
router.get('/signup', (req, res) => {

    res.render('signup', { title: "Signup", layout });

});

// -------POST SIGNUP--------
router.post('/signup',

    [
        check('firstName', 'Please enter the first name.').not().isEmpty(),
        check('email', 'Please enter email').isEmail(),
        check('password', 'Please enter the password.').isLength({ min: 6 }) // have to make room for errors in hbs
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('signup', {
                data: {},
                errors: errors.array(),
                message: 'Unable to create user!'
            });
        };

        try {

            let user = await User.findOne({ email: req.body.email });

            if (user) {
                data = {
                    title: "Signup",
                    layout,
                    error: "Email already registered! Please Login..."
                };
                res.render('signup', data);
            };

            user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                gender: req.body.gender,
                role: req.body.role
            });

            user.password = bcrypt.hashSync(req.body.password, 9);

            await user.save();

            res.redirect('/auth/login');

        } catch (error) {
            console.log(error.message);
            res.status(500).render('signup', { title: "Signup", layout, err: "Error while Registering the account" });
        }
    });


router.get('/login', (req, res) => {

    // checking if user is already logged in
    if (req.cookies.token) {
        console.log("cookies available", req.cookies)
        if (loggedUsers[jwt.verify(req.cookies['token'], config.secret)] == true) {
            res.redirect('/auth/user');
        } else {
            res.render('login', { msg: "Logged out", title: "Login", layout });
        }
    } else {
        console.log('No cookies')
        res.render('login', { title: "Login", layout });
    }

    // // SESSION BASED AUTHENTICATION

    // if (req.session && req.session.token) {
    //     console.log(`Session available::::: ${req.session}`);
    //     if (loggedUsers[jwt.verify(req.session.token, config.secret)] == true) {
    //         res.redirect('/auth/user');
    //     } else {
    //         res.render('login', { msg: "Logged out", title: "Login", layout });
    //     }
    // } else {
    //     console.log('No Session')
    //     res.render('login', { title: "Login", layout });
    // }


});

router.post('/login',
    [
        check('email', 'Please enter the email').isEmail(),
        check('password', 'Please enter the password').isLength({ min: 6 })  // have to make room for errors in hbs
    ],
    authRole,
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(400).render('login', {
                layout,
                title: "Err Login",
                errors: errors.array(),
                message: 'Unable to create user!'
            });
        }

        try {

            let user = await User.findOne({ email: req.body.email });

            if (!user) {
                res.render('login', { title: "Login", layout, message: "User not found! Please Signup first" });
            }

            const isMatch = bcrypt.compareSync(req.body.password, user.password);

            if (!isMatch) {
                res.render('login', { title: "Login", layout, message: "Invalid Password" });
            };


            const token = await jwt.sign(user.id, config.secret);
            console.log(token);
            // storing token in cookie
            res.cookie('token', token, { maxAge: 600000 });

            //storing token in express session
            // req.session.token = token;
            // console.log(`Session: ${req.session} :::: Req.session: ${req.session.token}`)

            loggedUsers[user._id] = true;
            console.log("Logged users: ", loggedUsers);

            res.redirect('/auth/user');

        } catch (error) {
            console.log(error.message);
            res.render('login', { title: 'Login', layout, message: "Error while Login..." });
        };

    });

// Admin Login

router.get('/admin', (req, res) => {
    res.render('admin', { title: "Admin", layout })
});

router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user });
        res.render('user', { title: `${user.firstName}'s profile`, layout, user });

    } catch (error) {
        console.log(error.message);
        res.render('login', { title: 'Login', layout, msg: "Error while Login..." });
    };
})

router.get('/user/profile', auth, async (req, res) => {
    console.log(req.cookies)
    try {
        const info = await Profile.findOne({ userId: req.user });
        const user = await User.findById({ _id: req.user });
        res.render('profile1', { title: `${user.firstName}'s profile`, layout, info, user });

    } catch (error) {
        console.log(error.message);
        res.render('login', { title: 'Login', layout, msg: "Error while Login..." });
    };
});

router.get('/user/update/:id', auth, async (req, res) => {
    const user = await User.findById({ _id: req.user });
    const info = await Profile.findOne({ userId: req.user });
    res.render('updprofile', { layout, title: "Update info", user, info });
});

router.post('/user/update/:id', auth, upload, async (req, res) => {
    const user = await User.findById({ _id: req.params.id });
    let info = await Profile.findOne({ userId: req.params.id });
    console.log(user) //TEST: to check the user info - will remove it soon
 try {
    if (!info) {
        info = new Profile({

            contact: req.body.contact,
            about: req.body.about,
            address: {
                street: req.body.street,
                state: req.body.state,
                city: req.body.city,
                zip: req.body.zip
            },
            image: req.file.filename,
            facebook: req.body.facebook,
            userId: user._id


        });
        await info.save()
    } else {

        info = await Profile.findOneAndUpdate({ userId: user._id }, {
            "$set": {

                contact: req.body.contact,
                about: req.body.about,
                address: {
                    street: req.body.street,
                    state: req.body.state,
                    city: req.body.city,
                    zip: req.body.zip
                },
                image: req.file.filename? req.file.filename: "",
                facebook: req.body.facebook,
                userId: user._id


            }
        });
    }
    // await info.save();
    // res.render('profile1', { layout, title: "Profile", user })
    res.redirect('/auth/user/profile');
 } catch (error) {
     if (error) console.log(error.message)
 }

});

router.get('/logout', async (req, res) => {

    loggedUsers[jwt.verify(req.cookies['token'], config.secret)] = false;

    res.redirect('/auth/login');
    console.log(loggedUsers); // to check if the id is set to false or not

});

router.get('/profile/writeblog', (req, res) => {
    res.render('writeblog', { layout, title: "Write blog here" })
})

router.get('/user/profile/pwdreset', (req, res)=> {
    res.render('pwdreset', {layout, title:"Reset Password"});
})

userRoutes = router;

module.exports = { userRoutes, loggedUsers };