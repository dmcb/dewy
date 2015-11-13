// Packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');

// Router handlers
var routes = require('./routes/index');

// Register express
var app = express();

// Define handlebars and helpers
var hbs = exphbs.create({
  defaultLayout: 'index',
  helpers: {
    ifEquals: function(leftValue, rightValue, result) {
      if (leftValue != rightValue) {
          return result.inverse(this);
      } else {
          return result.fn(this);
      }
    }
  }
});

// Register '.handlebars' extension
app.engine('.handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.handlebars');

// app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(express.static(path.join(__dirname, 'static')));

app.use('/', routes);

// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000);

module.exports = app;
