var usuario = require('../../app/controllers/users.server.controller'),
    ctrlParroquia = require('../../app/controllers/parroquia.controller'),
    ctrl = require('../../app/controllers/parroquia.zona.controller');

module.exports = function (app) {
// routes parroquia
    app.route('/api/parroquia')
        .get(usuario.requiresLogin, ctrlParroquia.queryParroquia);

    app.route('/api/parroquia/:_id')
        .get(usuario.requiresLogin, ctrlParroquia.getParroquiaById);

// routes parroquia zona
    app.route('/api/parroquia/:id_parroquia/zona')
        .get(usuario.requiresLogin, ctrl.queryZona)
        .post(usuario.requiresLogin, ctrl.createZona);

    app.route('/api/parroquia/:id_parroquia/zona/:_id')
        .get(usuario.requiresLogin, ctrl.getZonaById)
        .put(usuario.requiresLogin, ctrl.updateZona)
        .delete(usuario.requiresLogin, ctrl.deleteZona);

};
