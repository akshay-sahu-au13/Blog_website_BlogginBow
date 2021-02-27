const jwt = require('jsonwebtoken');
const config = require('../config/config');
const path = require('path')
const layout = path.join('layouts', "index");
const auth = function(req, res, next) {

        if ( ! req.cookies['token']) {
            data = {msg:"Please login to access profile page!"}
            return res.render( 'login',{ data, layout});
        }


            else if ( req.cookies['token'] ) {
            const decoded = jwt.verify(req.cookies['token'], config.secret);
            // console.log(decoded);
            req.user = decoded;
            
        }
        next();
        
    } ;

module.exports = auth;