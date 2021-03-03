const mongoose = require('mongoose');

const profileInfo = mongoose.Schema({
    about: {
        type: String,
        default: "Tell us about yourself..."
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
        ref: "reg_user",
        default: null
    },
    image: String

});

module.exports = mongoose.model('profile', profileInfo);