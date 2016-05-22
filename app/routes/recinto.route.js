var usuario = require('../../app/controllers/users.server.controller'),
    ctrlRecinto = require('../../app/controllers/recinto.controller'),
    ctrl = require('../../app/controllers/recinto.junta.controller');

module.exports = function (app) {
// routes recinto
    app.route('/api/recinto')
        .get(usuario.requiresLogin, ctrlRecinto.queryRecinto);

    app.route('/api/recinto/:_id')
        .get(usuario.requiresLogin, ctrlRecinto.getRecintoById);


// routes recinto junta
    app.route('/api/recinto/:id_recinto/junta')
        .get(usuario.requiresLogin, ctrl.queryJunta)
        .post(usuario.requiresLogin, ctrl.createJunta);

    app.route('/api/recinto/:id_recinto/junta/:_id')
        .get(usuario.requiresLogin, ctrl.getJuntaById)
        .put(usuario.requiresLogin, ctrl.updateJunta)
        .delete(usuario.requiresLogin, ctrl.deleteJunta);

};
