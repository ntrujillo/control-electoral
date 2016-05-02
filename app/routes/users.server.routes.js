var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

module.exports = function (app) {
    app.route('/signup').get(users.renderSignup).post(users.signup);

    app.route('/signin').get(users.renderSignin).post(passport.authenticate('local', {
        successRedirect: '/#/authorization',
        failureRedirect: '/signin',
        failureFlash: true
    }));

    app.route('/api/users').get(users.getUsers).post(users.saveUser);
    app.route('/api/users/:idUser').get(users.getUserById).put(users.updateUser);

    app.get('/signout', users.signout);

};