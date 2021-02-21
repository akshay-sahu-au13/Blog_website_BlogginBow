const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    description: {
        type: String,
        default: "Description not available"
    },
    body: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    }
});