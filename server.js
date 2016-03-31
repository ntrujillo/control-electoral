process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose');
var passport = require('./config/passport');
var express = require('./config/express');

var port = 3005;
var db = mongoose();
var app = express();
//var app = express(db);
var passport = passport();
app.listen(port);
module.exports = app;

console.log('Server running at http://localhost:' + port);