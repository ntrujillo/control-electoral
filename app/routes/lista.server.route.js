var usuario = require('../../app/controllers/users.server.controller'),
    lista = require('../../app/controllers/lista.server.controller');

module.exports = function (app) {
    app.route('/api/lista/')
        .get(usuario.requiresLogin, lista.getListas).
        post(usuario.requiresLogin, lista.saveLista);
    app.route('/api/lista/:id_lista')
        .get(usuario.requiresLogin, lista.getListaById)
        .put(usuario.requiresLogin, lista.updateLista)
        .delete(usuario.requiresLogin, lista.deleteLista);

};