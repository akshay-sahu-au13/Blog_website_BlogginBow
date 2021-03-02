const express = require('express');
const router = express.Router();
const path = require("path");
const config = require('../config/config');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {auth, authRole} = require('../auth/auth');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const loggedUsers = {};
const layout = path.join('layouts', 'index');

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
        }

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
                role:req.body.role
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

    //checking if user is already logged in
    if (req.cookies.token) {
        console.log("cookies available", req.cookies)
        if (loggedUsers[jwt.verify(req.cookies['token'], config.secret)] == true) {
            res.redirect('/auth/profile');
        } else {
            res.render('login', {msg: "Logged out", title:"Login", layout});
        }
    } else {
        console.log('No cookies')
        res.render('login', { title: "Login", layout });
    }

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
            // console.log(token);
            res.cookie('token', token, { maxAge: 30000 });

            loggedUsers[user._id] = true;
            console.log("Logged users: ", loggedUsers );

            res.redirect('/auth/profile');

        } catch (error) {
            console.log(error.message);
            res.render('login', {title: 'Login', layout, msg: "Error while Login..."});
        };

    });

// Admin Login

router.get('/admin', (req, res)=> {
    res.render('admin', {title:"Admin", layout})
});

router.get('/profile', auth, async (req, res) => {
    const user = await User.findById({ _id: req.user })
    res.render('profile', { title: `${user.firstName}'s profile`, layout, user });
});


router.get('/logout', async(req, res)=> {

    loggedUsers[jwt.verify(req.cookies['token'], config.secret)] = false;

        res.redirect('/auth/login');
    console.log(loggedUsers); // to check if the id is set to false or not

});

module.exports = {router, loggedUsers};