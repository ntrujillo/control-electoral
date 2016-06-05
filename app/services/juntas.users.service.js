var JuntaUser = require('mongoose').model('JuntaUser'),
    Junta = require('mongoose').model('Junta'),
    Logger = require(__dirname + '/../../app/log/Logger'),
    Q = require('q');

var plus = "+";
var comma = ",";

var service = {};
service.create = create;
service.query = query;

module.exports = service;

function create(id_user, body) {
    var deferred = Q.defer();
    // validation
    JuntaUser.findOne({id_user: id_user}, function (err, response) {
        if (err) deferred.reject(err);
        if (response) {
            response.junta.push(body.junta);

        } else {
            response = new JuntaUser({id_user: id_user, junta: body.junta});
        }
        response.save(function (err) {
            if (err)deferred.reject(err);
            Junta.findOne({_id: body.junta}, function (err, jun) {
                if (err) deferred.reject(err);
                jun.status = body.status;
                jun.save(function (err) {
                    if (err)deferred.reject(err);
                    deferred.resolve();
                });
            });
        });
    });
    return deferred.promise;
}

function query(id_user, fields, sort, page, perPage) {

    var criteria = {};
    var response = {};
    var deferred = Q.defer();

    if (id_user) {
        criteria.id_user = id_user;
    }

    if (sort) {
        sort = sort.replace(plus, '');
        sort = sort.replace(comma, ' ');
    }
    if (fields) {
        fields = fields.replace(comma, ' ');
    }
    if (page) {
        page = parseInt(page);
        if (perPage) {
            perPage = parseInt(perPage);
        } else {
            perPage = 10;
        }
    }

    JuntaUser.find(criteria).count(function (error, count) {

        if (error) {
            deferred.reject(err);
        }

        response.count = count;
        JuntaUser.findOne(criteria)
            .populate({
                path: 'junta',
                select: 'gender junta empadronados recinto status',
                populate: {
                    path: 'recinto', select: 'zona name', model: 'Recinto',
                    populate: {
                        path: 'zona', select: 'parroquia name', model: 'Zona',
                        populate: {
                            path: 'parroquia', select: 'canton name code', model: 'Parroquia',
                            populate: {
                                path: 'canton',
                                select: 'provincia name code',
                                model: 'Canton',
                                populate: {path: 'provincia', select: 'name code', model: 'Provincia'}
                            }
                        }
                    }
                }
            })
            .exec(function (error, juntas) {
                if (error) {
                    deferred.reject(err);
                }
                response.juntasUser = juntas;
                deferred.resolve(response);
            });
    });
    return deferred.promise;
}

