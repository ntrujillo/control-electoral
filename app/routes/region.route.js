var usuario = require('../../app/controllers/users.server.controller'),
    ctrlRegion = require('../../app/controllers/region.server.controller');

module.exports = function (app) {
// routes recinto
    app.route('/api/region')
        .get(usuario.requiresLogin, ctrlRegion.getRegiones);
};
