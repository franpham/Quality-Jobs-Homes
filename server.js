"use strict";

// NEED TO USE Node 4.0.0 to include mongodb's dependency (kerberos@~0.0) and monk's dependency (mongodb@~1.4);
const PORT = process.env.PORT || 3000;
var methodOverride = require('method-override');
var parser = require('body-parser');
var request = require('request-json');
var express = require('express');
var app = express();

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/hire');    // set mongo to "use hire" database;
var client = request.createClient('http://localhost:3003');    // use port different from server;

var routes = require('./routes/index.js');
app.set ('view engine', 'jade');
app.set('views', './views');

app.use(function(req, res, next) {        // MUST BE before ALL routes;
  req.db = db;
  next();
});
app.use(methodOverride('_method'));        // enable PUT & DELETE methods;
app.use(parser.urlencoded({ extended: true }));       // parse form data;
app.use(parser.json());                    // for parsing application/ json;
app.use(express.static('./public'));
app.use('/', routes);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;   // not found: must be AFTER ALL routes and use() paths;
    next(err);
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);    // error handling for middleware: must be AFTER ALL use() calls;
  res.render('error', {
    message : err.message,
    error : (app.get('env') === 'development' ? err : {})
  });
});

app.listen(PORT, function() {
  console.log('App is listening on port:', PORT);
});

// START MONGO AT TERMINAL: mongod --dbpath ./data/
// START NODE  AT TERMINAL: nodemon server.js