process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose');
var passport = require('./config/passport');
var express = require('./config/express');
var sequelize = require('./config/sequelize-connect');
var Logger = require('./app/log/ILogger');

var loggerApi = new Logger('Server');
var port = 3002;
var db = mongoose();
//en caso se necesite cambiar a mysqlPostgres
//var dbSe= sequelize();
var app = express();
//var app = express(db);
var passport = passport();

app.listen(port);
module.exports = app;
loggerApi.info('Server running at http://localhost:', port);