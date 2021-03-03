const mongoose = require('mongoose');

const profileInfo = mongoose.Schema({
    about: {
        type: String,
        default: "Tell us about yourself..."
    },
    image: {
        type: String
    },
    Address: {
        type: String,
        default: "Where do you live?"
    },
    contact: {
        type: Number,
        default: "Please update the Number"
    },
    facebook: {
        type: String
    },

});

module.exports = mongoose.model('profile', profileInfo);