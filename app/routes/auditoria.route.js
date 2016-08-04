var usuario = require('../../app/controllers/users.server.controller'),
    ctrl = require('../../app/controllers/auditoria.voto.controller');

module.exports = function (app) {
    // routes canton
    app.route('/api/auditoria')
        .post(ctrl.saveRegistro);

};


