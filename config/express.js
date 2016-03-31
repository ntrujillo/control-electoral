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
    require('../app/routes/province.server.route.js')(app);
    require('../app/routes/canton.server.route.js')(app);
    require('../app/routes/parroquia.server.route.js')(app);
    require('../app/routes/zona.server.route.js')(app);
    require('../app/routes/recinto.server.route.js')(app);
    require('../app/routes/junta.server.route.js')(app);
    require('../app/routes/lista.server.route.js')(app);
    require('../app/routes/votos.server.route.js')(app);
    app.use(express.static('./public'));
    return app;
    // return server;
};