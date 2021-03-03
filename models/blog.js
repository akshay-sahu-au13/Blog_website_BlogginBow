const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reg_user",
        default: null
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

module.exports = mongoose.model('blog', blogSchema);