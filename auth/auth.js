const jwt = require('jsonwebtoken');
const config = require('../config/config');
const auth = function(req, res, next) {

        if ( '/login' !== req.path && ! req.cookies.hasOwnProperty( 'token' ) ) {
            data = {msg:"Please login to access this page!"}
            return res.redirect( '/login', data );
        }
        // Check if it's login page and my-token is existed > redirect to home page
        else if ( '/login' === req.path && req.cookies.hasOwnProperty( 'token' ) ) {
            const decoded = jwt.verify(req.cookies['token'], config.secret);
            req.user = decoded.user;
        }
     
        next();
    } ;
