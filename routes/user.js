const express = require('express');
const router = express.Router();
const path = require("path");
const cookie = require( 'cookie-parser' );
const User = require('../models/user');

const layout = path.join('layouts','index');
// const layout = path.join('layouts', "index");

router.get('/signup', (req, res)=> {
    res.render('signup', {title: "Signup", layout})
});


router.get('/login', (req, res)=> {
    res.render('login', {title: "Login", layout})
})

module.exports = router;