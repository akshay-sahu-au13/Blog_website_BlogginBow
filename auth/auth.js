const jwt = require('jsonwebtoken');
const config = require('../config/config');
const path = require('path')
const layout = path.join('layouts', "index");
const User = require('../models/user');
const auth = function (req, res, next) {

    if (!req.cookies['token']) {
        data = { msg: "Please login to access profile page!" }
        return res.render('login', { data, layout });
    }


    else if (req.cookies['token']) {
        const decoded = jwt.verify(req.cookies['token'], config.secret);
        // console.log(decoded);
        req.user = decoded;

    }
    next();

};

const authRole = async function (req, res, next) {

    try {
        if (req.body.admin === 'on') {

            const user = await User.findOne({ email: req.body.email });
            // console.log(user)
            if (user.role === "admin") {
                data = { msg: "Logged in as admin" }
                return res.redirect('/auth/admin');
            }
                return res.status(401).send(`<center><h1 style = "color: Red;">You are NOT AUTHORISED to view this page!</h1></center>`)

            
        } else {
            
            next()
        }
    } catch (error) {
        if (error) console.log(error)
    }
}

module.exports = { auth, authRole };