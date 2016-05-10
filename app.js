var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* ROUTES */
var routes    = require('./routes/index');
var users     = require('./routes/users');
var login     = require('./routes/login');
var dashboard = require('./routes/dashboard');
var clients   = require('./routes/clients');

require('./lib/util.js');
require('./lib/logger.js');

require('./db').setup('bank', /*pass:*/'root', /*pass:*/'root', {
  host: 'localhost'
}).complete(function(err) {
  if(err) {
    log.fatal('Could not connect to the database.');
    log.error(err);
    return;
  }
});

var app = express();

// session setup
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/dashboard', dashboard);
app.use('/clients', clients);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(req, res, next) {
  if (!req.session.user) {
    res.redirect('login');
  } else {
    res.redirect('dashboard');
  }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
