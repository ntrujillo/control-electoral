var cantones = require('../../app/controllers/canton.server.controller');

module.exports = function (app) {
    app.route('/api/cantones/:codeProvince')
        .get(cantones.getCantonesByProvince);

};