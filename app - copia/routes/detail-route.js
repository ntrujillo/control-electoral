var controller = require('../controllers/detail-ctrl');

module.exports = function (app) {

    app.route('/api/detail')
        .get(controller.queryDetails)
        .post(controller.createDetail);

    app.route('/api/detail/search').get(controller.search);

    app.route('/api/detail/:id')
        .get(controller.getDetail);
};

