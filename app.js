var config = require("./config");

var express = require('express');
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');
var session = require('express-session');
var helmet = require('helmet');

var routes = require('./routes');
var connection = require('./db/connection');
connection.initConnection();


 
let app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cookieparser());
app.use(session({
  name: config.secret_session_name,
  secret: config.secret_session_key,
  cookie: {
    httpOnly: true,
    secure: false
  },
  resave: false,
  saveUninitialized: false
}));
app.use(function printSession(req, res, next) {
  console.log('----------SESSION LOGGER--------\n', req.session,'\n-----------END_LOGGER-----------');
  return next();
});

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}

app.use(allowCrossDomain);
app.use(helmet());
routes.configure(app);



module.exports = app;