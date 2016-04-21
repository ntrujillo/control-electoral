var menu = require('../../app/controllers/menu.server.controller'),
    usuario = require('../../app/controllers/users.server.controller');

module.exports = function (app) {
    app.route('/api/menu')
        .get(menu.getMenuParents)
        .post(menu.saveMenu);

    app.route('/api/menu/:idParent')
        .get(menu.getMenuChilds);
};