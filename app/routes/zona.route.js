var usuario = require('../../app/controllers/users.server.controller'),
    ctrlZona = require('../../app/controllers/zona.controller'),
    ctrl = require('../../app/controllers/zona.recinto.controller');

module.exports = function (app) {
// routes zona
    app.route('/api/zona')
        .get(usuario.requiresLogin, ctrlZona.queryZona);

    app.route('/api/zona/:_id')
        .get(usuario.requiresLogin, ctrlZona.getZonaById);

// routes zona recinto
    app.route('/api/zona/:id_zona/recinto')
        .get(usuario.requiresLogin, ctrl.queryRecinto)
        .post(usuario.requiresLogin, ctrl.createRecinto);

    app.route('/api/zona/:id_zona/recinto/:_id')
        .get(usuario.requiresLogin, ctrl.getRecintoById)
        .put(usuario.requiresLogin, ctrl.updateRecinto)
        .delete(usuario.requiresLogin, ctrl.deleteRecinto);
};

