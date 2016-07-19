"use strict";

let express = require('express'),
    http = require('http'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    expressSession = require('express-session'),
    moment = require('moment'),
    logger = require('morgan'),
    favicon = require('static-favicon'),
    busboy = require('connect-busboy');

/*port*/
let port = 3000;

let app = express();

let db = require('./models/db.js');
mongoose.connect(db.url);

/*set views*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*set routes*/
require('./routes/route')(app);

/*use modules*/
app.locals.moment = moment;
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlEncoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true,
}));
app.use(busboy());

app.listen(port, () => {
    console.log('server listened on ' + port);
});