var config = require('./config'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport');

module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(methodOverride());


    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
        // store: mongoStore
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/registro-route.js')(app);
    require('../app/routes/detail-route.js')(app);
    require('../app/routes/provincia.server.route.js')(app);
    require('../app/routes/canton.route.js')(app);
    require('../app/routes/parroquia.route.js')(app);
    require('../app/routes/zona.route.js')(app);
    require('../app/routes/recinto.route.js')(app);
    require('../app/routes/junta.server.route.js')(app);
    require('../app/routes/lista.server.route.js')(app);
    require('../app/routes/junta.user.route.js')(app);
    require('../app/routes/votos.server.route.js')(app);
    require('../app/routes/rol.server.route.js')(app);
    require('../app/routes/usuarioRol.server.route.js')(app);
    require('../app/routes/region.route.js')(app);
    require('../app/routes/auditoria.route.js')(app);
    app.use(express.static('./public'));
    return app;
    // return server;
};