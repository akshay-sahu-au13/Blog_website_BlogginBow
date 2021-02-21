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

    dob: {
        type: Date,
        required: true
    },
    sex: String,
    password: {
        type: String,
        required: true
    }

},{timestamps: true});

module.exports = mongoose.model('user', userSchema);