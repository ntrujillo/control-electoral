var usuario = require('../../app/controllers/users.server.controller'),
    ctrlCanton = require('../../app/controllers/canton.controller');
ctrl = require('../../app/controllers/canton.parroquia.controller');


module.exports = function (app) {
    // routes canton
    app.route('/api/canton')
        .get(usuario.requiresLogin, ctrlCanton.queryCanton);

    app.route('/api/canton/:_id')
        .get(usuario.requiresLogin, ctrlCanton.getCantonById);


// routes canton parroquia
    app.route('/api/canton/:id_canton/parroquia')
        .get(usuario.requiresLogin, ctrl.queryParroquia)
        .post(usuario.requiresLogin, ctrl.createParroquia);

    app.route('/api/canton/:id_canton/parroquia/:_id')
        .get(usuario.requiresLogin, ctrl.getParroquiaById)
        .put(usuario.requiresLogin, ctrl.updateParroquia)
        .delete(usuario.requiresLogin, ctrl.deleteParroquia);
};


