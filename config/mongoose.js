var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    var db = mongoose.connect(config.db);
    require('../app/models/user.server.model');
    require('../app/models/rol.server.model');
    require('../app/models/usuarioRol.server.model');
    require('../app/models/registro');
    require('../app/models/detail');
    require('../app/models/provincia');
    require('../app/models/canton');
    require('../app/models/parroquia');
    require('../app/models/zona');
    require('../app/models/recinto');
    require('../app/models/junta');
    require('../app/models/lista.server.model');
    require('../app/models/votos.server.model');
    require('../app/models/detalleValidos.server.model');
    return db;
};