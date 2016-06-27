var rol = require('../../app/controllers/rol.server.controller'),
    user = require('../../app/controllers/users.server.controller');

module.exports = function (app) {
    app.route('/api/rol')
        .get(user.requiresLogin, rol.getRoles)
        .post(user.requiresLogin, rol.saveRol);
    app.route('/api/rol/:rol')
        .get(user.requiresLogin, rol.getStatusRol);
    app.route('/api/rolId/:_idRol')
        .get(user.requiresLogin, rol.getRolById)
        .put(user.requiresLogin, rol.updateRol);
    app.route('/api/roles')
        .get(user.requiresLogin, rol.getRolesByStatus);
};