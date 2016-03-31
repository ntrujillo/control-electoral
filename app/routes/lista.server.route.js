var lista = require('../../app/controllers/lista.server.controller');

module.exports = function (app) {
    app.route('/api/lista')
        .get(lista.getListas).
        post(lista.saveLista);

};