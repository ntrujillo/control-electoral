var ctrl = require('../../app/controllers/provincia.controller'),
    usuario = require('../../app/controllers/users.server.controller'),
    ctrlCanton = require('../../app/controllers/provincia.canton.controller');


module.exports = function (app) {
// routes provincias
    app.route('/api/provincia')
        .get(usuario.requiresLogin, ctrl.queryProvincia)
        .post(usuario.requiresLogin, ctrl.createProvincia);

    app.route('/api/provincia/:_id')
        .get(usuario.requiresLogin, ctrl.getProvinciaById)
        .put(usuario.requiresLogin, ctrl.updateProvincia)
        .delete(usuario.requiresLogin, ctrl.deleteProvincia);

    //routes provinciacanton
    app.route('/api/provincia/:id_provincia/canton')
        .get(usuario.requiresLogin, ctrlCanton.queryCanton)
        .post(usuario.requiresLogin, ctrlCanton.createCanton);

    app.route('/api/provincia/:id_provincia/canton/:_id')
        .get(usuario.requiresLogin, ctrlCanton.getCantonById)
        .put(usuario.requiresLogin, ctrlCanton.updateCanton)
        .delete(usuario.requiresLogin, ctrlCanton.deleteCanton);
};



