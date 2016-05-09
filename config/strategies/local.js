var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function () {
    passport.use(new LocalStrategy(function (username, password, done) {
        User.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'CONTAINER.SECURITY.LBL_UNKNOWN_USER'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'CONTAINER.SECURITY.LBL_INVALID_PASSWORD'
                });
            }
            if (user.status === 'B') {
                return done(null, false, {
                    message: 'CONTAINER.SECURITY.LBL_USER_STATUS'
                });
            }

            return done(null, user);
        });
    }));
};