exports.render = function (req, res) {
    res.render('index', {title: 'Hola mundo', user: JSON.stringify(req.user), messages: JSON.stringify(req.messages)});
};