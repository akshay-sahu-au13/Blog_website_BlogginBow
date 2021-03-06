const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

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
    },
    markdown: {
        type: String,
        default: "Not converted to MD"
    },
    slug: {
        type: String,
        required: true,
        unique: true
      },
      sanitizedHtml: {
        type: String,
        required: true
      }
});

blogSchema.pre('validate', function(next) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true })
    }
  
    if (this.body) {
      this.sanitizedHtml = dompurify.sanitize(marked(this.body))
    }
  
    next();
  });

module.exports = mongoose.model('user_blog', blogSchema);