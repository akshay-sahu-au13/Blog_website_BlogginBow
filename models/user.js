const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }

},{timestamps: true});

module.exports = mongoose.model('reg_user', userSchema);