const mongoose = require('mongoose');

const profileInfo = mongoose.Schema({
    about: {
        type: String,
        default: "Tell us about yourself..."
    },
    image: {
        type: String
    },
    address: {
        street: String,
        state: String,
        city: String,
        zip: String,
    
    },
    contact: {
        type: Number,
        default: "Please update the Number"
    },
    facebook: {
        type: String,
        default: "None"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    }

});

module.exports = mongoose.model('profile', profileInfo);