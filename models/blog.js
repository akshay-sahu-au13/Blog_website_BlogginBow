const mongoose = require('mongoose');
const md = require('marked');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        // required: true
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
        // required: true
    },
    genre: {
        type: String,
        // required: true
    }
});

blogSchema.pre('body', function(next){
    if(this.body){
        this.body = marked(this.body);
    }

    next();
})

module.exports = mongoose.model('user_blog', blogSchema);