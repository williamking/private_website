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
app.use(compress());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(favicon());
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
app.use(logger('dev'));

/*set routes*/
require('./routes/route')(app);

let server = http.createServer(app);
server.listen(port, '127.0.0.1', () => {
    console.log('The NODE_ENV is: ' + process.env.NODE_ENV);
    console.log('server listened on ' + port);
});
