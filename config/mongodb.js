const mongoose = require('mongoose');

const MongoUri = "mongodb+srv://akshay:admin@cluster0.3sl2w.mongodb.net/atlasdb?retryWrites=true&w=majority";

const MongoInit = async ()=> {

    await mongoose.connect(MongoUri, {useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology:true});
    console.log("Connected to Mongo AtlasDB...");
}

module.exports = MongoInit;