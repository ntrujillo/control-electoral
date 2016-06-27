var junta = require('../../app/controllers/junta.server.controller');

module.exports = function (app) {
    /*app.route('/api/juntas/:codeRecinto')
     .get(junta.getJuntasByRecinto);*/

    app.route('/api/juntas/:codeRecinto/:genero')
        .get(junta.getJuntasByRecintoByGenero);

    /*app.route('/api/juntas/:codeRecinto/:genero/:codeJunta')
     .get(junta.getJunta);*/

    app.route('/api/juntas/:id')
        .get(junta.getJunta);

};