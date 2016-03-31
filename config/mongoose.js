var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    var db = mongoose.connect(config.db);
    require('../app/models/user.server.model');
    require('../app/models/registro');
    require('../app/models/detail');
    require('../app/models/province.server.model');
    require('../app/models/canton.server.model');
    require('../app/models/parroquia.server.model');
    require('../app/models/zona.server.model');
    require('../app/models/recinto.server.model');
    require('../app/models/junta.server.model');
    require('../app/models/lista.server.model');
    require('../app/models/votos.server.model');
    require('../app/models/detalleValidos.server.model');
    return db;
};