var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

module.exports = function (app) {
    app.route('/signup').get(users.renderSignup).post(users.signup);

    app.route('/signin').get(users.renderSignin).post(passport.authenticate('local', {
        successRedirect: '/#/authorization',
        failureRedirect: '/signin',
        failureFlash: true
    }));

    app.route('/api/users').get(users.requiresLogin, users.getUsers).post(users.requiresLogin, users.saveUser);
    app.route('/api/users/:idUser').get(users.requiresLogin, users.getUserById).put(users.requiresLogin, users.updateUser);
    app.route('/api/user/:cedula').get(users.requiresLogin, users.getUserByCedula);

    app.get('/signout', users.signout);

};