var menuRol = require('../../app/controllers/menuRol.server.controller'),
    usuario = require('../../app/controllers/users.server.controller');

module.exports = function (app) {
    app.route('/api/menuRol')
        .post(menuRol.saveMenuRol);
};