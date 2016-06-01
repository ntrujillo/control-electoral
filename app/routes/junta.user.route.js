var juntaUser = require('../../app/controllers/juntas.users.controller'),
    usuario = require('../../app/controllers/users.server.controller');

module.exports = function (app) {

    app.route('/api/juntasUser/:id_user')
        .post(usuario.requiresLogin, juntaUser.createJuntaUser)
        .get(usuario.requiresLogin, juntaUser.getJuntaUser);

};