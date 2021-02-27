const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const userRoutes = require('./routes/user');
const MongoInit = require('./config/mongodb');
const layout = path.join('layouts', "index");

const PORT = process.env.PORT || 5100;

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/auth', userRoutes);
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'views'));
// app.engine('hbs', hbs({
//     defaultLayout: 'index',
//     extname: '.hbs',
//     layoutsDir: path.join(__dirname, 'layouts')
//    }))

app.get('/', (req, res)=> {
    res.render('home', {title: " BlogginBow home", layout});
});



app.listen(PORT, ()=> {
    console.log(`Listening to http://localhost:${PORT}`);
})

