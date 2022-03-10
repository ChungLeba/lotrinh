var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//CORS
var cors = require('cors')
var allowlist = ['http://new.lotrinh.vn', 'http://lotrinh.vn']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// Favicon
var favicon = require('serve-favicon')

//ROUTER
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin.router');
var partnerRouter = require('./routes/partner.router');

var app = express();
//cors
app.options('*', cors(corsOptionsDelegate))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// render time with moment
app.locals.moment = require('moment');
// Favicon
app.use(favicon(path.join(__dirname, 'public/images/favicon_io/', 'favicon.ico')))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//use Router
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/partner', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
