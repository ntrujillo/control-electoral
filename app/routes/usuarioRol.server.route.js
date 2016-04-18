var usuarioRol = require('../../app/controllers/usuarioRol.server.controller');

module.exports = function (app) {
    app.route('/api/usuarioRol')
        .post(usuarioRol.saveUsuarioRol);
};