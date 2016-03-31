var controller = require('../controllers/registro-ctrl');

module.exports = function (app) {
    app.route('/api/registro')
        .get(controller.queryRegistros)
        .post(controller.createRegistro);

    app.route('/api/registro/:id')
        .get(controller.getRegistro)
        .delete(controller.deleteRegistro);

    app.route('/api/registro/search').get(controller.search);
};

