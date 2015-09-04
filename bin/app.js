// Generated by LiveScript 1.3.1
(function(){
  var express, http, path, cookieParser, bodyParser, mongoose, expressSession, db, logger, favicon, app, index, factory, exports;
  express = require('express');
  http = require('http');
  path = require('path');
  cookieParser = require('cookie-parser');
  bodyParser = require('body-parser');
  mongoose = require('mongoose');
  expressSession = require('express-session');
  db = require('./db.js');
  logger = require('morgan');
  favicon = require('static-favicon');
  mongoose.connect(db.url);
  app = express();
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  index = require('./routes/index');
  factory = require('./routes/factory');
  app.use(favicon());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(express['static'](path.join(__dirname, 'public')));
  app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
  }));
  app.use('/factory', factory);
  app.use('/', index);
  app.use(function(req, res, next){
    var err;
    err = new Error('Not Found');
    err.status = 404;
    return next(err);
  });
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next){
      res.status(err.status || 500);
      return res.render('error', {
        message: err.message,
        error: err
      });
    });
  }
  app.listen(3000, function(){
    return console.log('Express listening on port 3000');
  });
  exports = module.exports = app;
}).call(this);
