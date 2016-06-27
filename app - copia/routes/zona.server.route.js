var zona = require('../../app/controllers/zona.server.controller');

module.exports = function (app) {
    app.route('/api/zonas/:codeParroquia')
        .get(zona.getZonasByParroquia);

};