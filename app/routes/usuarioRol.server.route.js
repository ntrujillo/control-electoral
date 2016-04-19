var usuarioRol = require('../../app/controllers/usuarioRol.server.controller'),
    usuario = require('../../app/controllers/users.server.controller');

module.exports = function (app) {
    app.route('/api/usuarioRol')
        .post(usuarioRol.saveUsuarioRol);
    app.route('/api/usuarioRol/:idUsuario')
        .get(usuario.requiresLogin, usuarioRol.getRolByUsuario);
};