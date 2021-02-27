const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const MongoInit = require('./config/mongodb');
const layout = path.join('layouts', "index");
const cookie = require( 'cookie-parser' );
const PORT = process.env.PORT || 5100;

// Connecting to MongoDB database
MongoInit();

// Starting express app
const app = express();

app.use( cookie() );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/auth', userRoutes);
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'views'));


app.get('/', (req, res)=> {
    res.render('home', {title: " BlogginBow home", layout});
});



app.listen(PORT, ()=> {
    console.log(`Listening to http://localhost:${PORT}`);
})

