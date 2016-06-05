var Canton = require('mongoose').model('Canton');
var Provincia = require('mongoose').model('Provincia');
var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'CONTAINER.CANTON.MESSAGE_ALREADY_CODE';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors.hasOwnProperty(errName)) {
                message = err.errors[errName];
            }
        }
    }
    return message;
};
var Q = require('q');
var plus = "+";
var comma = ",";

var service = {};

service.query = query;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function query(id_provincia, q, fields, sort, page, perPage) {

    var criteria = {};
    var response = {};
    var deferred = Q.defer();

    if (id_provincia) {
        criteria.provincia = id_provincia;
    }

    if (q) {
        criteria.code = q;
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

    Canton.find(criteria).count(function (error, count) {

        if (error) {
            deferred.reject(error);
        }

        response.count = count;
        //exec me permite dar mas especificaciones a find
        Canton.find(criteria)
            .select(fields)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec(function (error, cantons) {
                if (error) {
                    deferred.reject(error);
                }
                response.cantons = cantons;
                deferred.resolve(response);
            });

    });
    return deferred.promise;
}

function getById(id_provincia, id_canton) {
    var deferred = Q.defer();
    Canton.findOne({provincia: id_provincia, _id: id_canton})
        .populate('parroquias')
        .exec(function (err, item) {
            if (err) deferred.reject(err);
            if (item) {
                deferred.resolve(item);
            } else {
                // user not found
                deferred.resolve();
            }
        });

    return deferred.promise;
}


function create(id_provincia, body) {
    var deferred = Q.defer();

    body.provincia = id_provincia;
    Canton.create(
        body,
        function (err, doc) {
            if (err) {
                deferred.reject(getErrorMessage(err));
            } else {

                Provincia.findById(id_provincia, function (err, prov) {
                    prov.cantones.push(doc);
                    prov.save(function (error) {
                        if (error) deferred.reject(error);
                    });
                });
            }

            deferred.resolve();
        });

    return deferred.promise;
}

function update(id_provincia, id_canton, body) {
    var deferred = Q.defer();
    // validation
    Canton.findOne({provincia: id_provincia, _id: id_canton}, function (err, item) {
        if (err) deferred.reject(err);

        if (item.code !== body.code) {
            console.log(item);
            console.log(body);
            // code has changed so check if the new code is already taken
            Canton.findOne(
                {code: body.code},
                function (err, item) {
                    if (err) deferred.reject(err);

                    if (item) {
                        // canton code already exists
                        deferred.reject('Code "' + body.code + '" is already taken')
                    } else {
                        updateCanton(body);
                    }
                });
        } else {
            updateCanton(body);
        }
    });

    function updateCanton(obj) {
        Canton.findOne({provincia: id_provincia, _id: id_canton}, function (err, cant) {
            if (err) deferred.reject(err);
            cant.name = obj.name;
            cant.code = obj.code;
            cant.save(function (err) {
                if (err)deferred.reject(err);
                deferred.resolve();
            });


        });
    }

    return deferred.promise;
}

function _delete(id_canton) {
    var deferred = Q.defer();

    Canton.remove(
        {_id: id_canton},
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
