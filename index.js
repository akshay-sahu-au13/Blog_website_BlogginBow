const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');

const layout = path.join('layouts', "index");

const PORT = 4400;

const app = express();

app.set('view engine', 'hbs');
app.set(express.static('public'));
app.set('views', path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.listen(PORT, ()=> {
    console.log(`Listening to http://localhost:${PORT}`);
})

