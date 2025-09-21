// app.js (updated with MySQL session store)

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
var flash = require('connect-flash');
var csrf = require('csurf');
require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Database connection
const db = require('./config/dbconnection.js');

// ✅ Configure MySQL session store
const sessionStore = new MySQLStore({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_ROOT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

// ✅ Session middleware (must come before csrf)
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(session({
  key: process.env.SESSION_KEY,  // cookie name
  secret: process.env.SESSION_SECRET,             // secret key
  resave: false,                                  // only save if modified
  saveUninitialized: false,    // don't save empty sessions, it will save session after user login
  store: sessionStore, 
  rolling: true, //refresh session count                        
  // use MySQL for persistence
  cookie: {
    maxAge: 1000 * 60 * 10,  // 1 day
    httpOnly: true,
    secure: false,                 // set true if HTTPS
    sameSite: 'Strict'
  }
}));

// flash message middleware configurations
app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});

// Middleware to make session data available in templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// csrf middleware configurations
app.use(csrf({ cookie: true })); // use csrf with cookie

app.use(function (req, res, next) {

  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.locals.csrftoken = csrfToken;
  next();
  
});

// web and Api routes configuration
const initRoutes = require("./routes/web");
initRoutes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Make flash messages available in all views (optional, if using templates like EJS/Pug)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});

// Start the server
const PORT = process.env.NODE_PORT || 7000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on ${PORT}`);
});

module.exports = app;
