var rol = require('../../app/controllers/rol.server.controller'),
    user = require('../../app/controllers/users.server.controller');

module.exports = function (app) {
    app.route('/api/rol')
        .get(user.requiresLogin, rol.getRoles)
        .post(rol.saveRol);
    app.route('/api/rol/:rol')
        .get(user.requiresLogin, rol.getStatusRol);
};