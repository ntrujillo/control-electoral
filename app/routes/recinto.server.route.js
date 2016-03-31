var recinto = require('../../app/controllers/recinto.server.controller');

module.exports = function (app) {
    app.route('/api/recinto/:codeZona/:codeParroquia')
        .get(recinto.getRecintosByZonas);

};