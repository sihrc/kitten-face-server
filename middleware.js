/**
Adding Middleware
**/
var logger = require("morgan"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  session = require("express-session");

module.exports = function (app) {
  app.use(logger("kittyface"));
  app.use(bodyParser.json({limit: '70mb'}));
  app.use(bodyParser.urlencoded({limit: '70mb', extended: true}));
  app.use(cookieParser());
  app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  }));
}
