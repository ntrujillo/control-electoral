var junta = require('../../app/controllers/junta.server.controller'),
    usuario = require('../../app/controllers/users.server.controller');

module.exports = function (app) {
    app.route('/api/juntas/:codeRecinto/:genero')
        .get(usuario.requiresLogin, junta.getJuntasByRecintoByGenero);

    app.route('/api/juntas/:id')
        .get(usuario.requiresLogin, junta.getJunta);

    app.route('/api/juntasRest/')
        .get(usuario.requiresLogin, junta.getNumeroDeVotantes);

};