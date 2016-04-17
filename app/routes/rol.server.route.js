var rol = require('../../app/controllers/rol.server.controller');

module.exports = function (app) {
    app.route('/api/rol')
        .post(rol.saveRol);
};