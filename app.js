"use strict";
/* set node_env */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express'),
    http = require('http'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    expressSession = require('express-session'),
    moment = require('moment'),
    logger = require('morgan'),
    favicon = require('static-favicon'),
    busboy = require('connect-busboy'),
    spdy = require('spdy'),
    compress = require('compression');

/*port*/
const { port, database } = require('./config/config');

const app = express();

mongoose.connect(database);

/*set views*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*use modules*/
app.locals.moment = moment;
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon());
app.use(compress());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true,
    name: 'session',
    keys: ['user']
}));
app.use(busboy());

/*set routes*/
require('./routes/route')(app);

let { spdy_options } = require('./config/config');
let server = spdy.createServer(spdy_options, app);
server.listen(port, () => {
    console.log('The NODE_ENV is: ' + process.env.NODE_ENV);
    console.log('server listened on ' + port);
});
