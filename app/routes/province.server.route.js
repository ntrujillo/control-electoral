var provinces = require('../../app/controllers/province.server.controller');

module.exports = function (app) {
    app.route('/api/provinces')
        .get(provinces.getProvinces);
};