var sequelize = require('../../config/sequelize-connect');
Sequelize = require('sequelize');
//var sequelize = new Sequelize('postgres://postgres:alcivar1703:5432/seanjs_dev');
/*var sequelize = new Sequelize('seanjs_dev', 'postgres', 'alcivar1703', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});*/

var db=sequelize();
console.log('se', sequelize);
console.log('ddb', db);
var User = db.define('modelName', {
    columnA: Sequelize.BOOLEAN,
    columnB: Sequelize.STRING,
    columnC: Sequelize.STRING
});

User.sync({force: true}).then(function () {
    // Table created
    return User.create({
        columnA: true,
        columnB: 'Hancock',
        columnC: 'Hancock2'
    });
});
db.models.modelName