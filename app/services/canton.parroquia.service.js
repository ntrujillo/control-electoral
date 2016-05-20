var Canton = require('mongoose').model('Canton');
var Parroquia = require('mongoose').model('Parroquia');
var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'CONTAINER.PARROQUIA.MESSAGE_ALREADY_CODE';
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
var service = {};
var plus = "+";
var comma = ",";

service.query = query;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function query(id_canton, q, fields, sort, page, perPage) {

    var criteria = {};
    var response = {};
    var deferred = Q.defer();

    if (id_canton) {
        criteria.canton = id_canton;
    }

    if (q) {
        criteria = {code: q};
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

    Parroquia.find(criteria).count(function (error, count) {

        if (error) {
            deferred.reject(err);
        }

        response.count = count;
        //exec me permite dar mas especificaciones a find
        Parroquia.find(criteria)
            .select(fields)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec(function (error, parroquias) {
                if (error) {
                    deferred.reject(err);
                }
                response.parroquias = parroquias;
                deferred.resolve(response);
            });

    });
    return deferred.promise;
}

function getById(id_canton, id_parroquia) {
    var deferred = Q.defer();
    Parroquia.findOne({canton: id_canton, _id: id_parroquia})
        .populate('zonas')
        .exec(function (err, item) {
            if (err) deferred.reject(err);
            if (item) {
                deferred.resolve(item);
            } else {
                // not found
                deferred.resolve();
            }
        });

    return deferred.promise;
}


function create(id_canton, body) {
    var deferred = Q.defer();
    body.canton = id_canton;
    Parroquia.create(
        body,
        function (err, doc) {
            if (err) {
                deferred.reject(getErrorMessage(err));
            } else {

                Canton.findById(id_canton, function (err, canton) {
                    canton.parroquias.push(doc);
                    canton.save(function (error) {
                        if (error) deferred.reject(error);
                    });
                });
            }

            deferred.resolve();
        });

    return deferred.promise;
}

function update(id_canton, id_parroquia, body) {
    var deferred = Q.defer();
    // validation
    Parroquia.findOne({canton: id_canton, _id: id_parroquia}, function (err, item) {
        if (err) deferred.reject(err);

        if (item.code !== body.code) {
            // code has changed so check if the new code is already taken
            Parroquia.findOne(
                {code: body.code},
                function (err, item) {
                    if (err) deferred.reject(err);

                    if (item) {
                        // codigo de parroquia already exists
                        deferred.reject('Code "' + body.code + '" is already taken')
                    } else {
                        updateParroquia(body);
                    }
                });
        } else {
            updateParroquia(body);
        }
    });

    function updateParroquia(obj) {
        Parroquia.findOne({canton: id_canton, _id: id_parroquia}, function (err, parr) {
            if (err) deferred.reject(err);
            parr.name = obj.name;
            parr.code = obj.code;
            parr.save(function (err) {
                if (err)deferred.reject(err);
                deferred.resolve();
            });


        });
    }

    return deferred.promise;
}

function _delete(id_parroquia) {
    var deferred = Q.defer();

    Parroquia.remove(
        {_id: id_parroquia},
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
