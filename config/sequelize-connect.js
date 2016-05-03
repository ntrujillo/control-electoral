var config = require('./config'),
    Sequelize = require('sequelize');

module.exports = function () {
    var db = new Sequelize(config.sequelize.db.name, config.sequelize.db.username, config.sequelize.db.password, {
        host: config.sequelize.db.host,
        port: config.sequelize.db.port,
        dialect: config.sequelize.db.dialect
    });
    require('../app/models/userSequelize');
    return db;
};