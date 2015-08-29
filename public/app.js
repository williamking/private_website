// Generated by LiveScript 1.3.1
(function(){
  var logger, flash, favicon, app, initPassport, index, exports;
  require({
    'express': 'express',
    'http': 'http',
    'cookie-parser': 'cookie-parser',
    'body-parser': 'body-parser',
    'mongoose': 'mongoose',
    'passport': 'passport',
    'express-session': 'express-session',
    './db': './db'
  });
  logger = require('morgan');
  flash = require('connect-flash');
  favicon = require('static-favicon');
  mongoose.connect(db.url);
  app = express();
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(favicon());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(express['static'](path.join(__dirname, 'public')));
  app.use(expressSession({
    secret: 'mySecretKey'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  initPassport = require('./passport/init');
  initPassport(passport);
  index = require('./routes/index')(passport);
  app.use('/', routes);
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
  app.listen(3000);
  exports = module.exports = app;
}).call(this);