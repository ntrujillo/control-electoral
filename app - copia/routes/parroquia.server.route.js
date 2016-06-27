var parroquia = require('../../app/controllers/parroquia.server.controller');

module.exports = function (app) {
    app.route('/api/parroquias/:codeCanton')
        .get(parroquia.getParroquiasByCanton);

};