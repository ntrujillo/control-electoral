var Zona = require('mongoose').model('Zona');
var Recinto = require('mongoose').model('Recinto');
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

function query(id_zona, q, fields, sort, page, perPage) {

    var criteria = {};
    var response = {};
    var deferred = Q.defer();

    if (id_zona) {
        criteria.zona = id_zona;
    }

    if (q) {
        criteria.$text = {$search: q}
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

    Recinto.find(criteria).count(function (error, count) {

        if (error) {
            deferred.reject(err);
        }

        response.count = count;
        //exec me permite dar mas especificaciones a find
        Recinto.find(criteria)
            .select(fields)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec(function (error, recintos) {
                if (error) {
                    deferred.reject(err);
                }
                response.recintos = recintos;
                deferred.resolve(response);
            });

    });
    return deferred.promise;
}

function getById(id_zona, id_recinto) {
    var deferred = Q.defer();
    Recinto.findOne({zona: id_zona, _id: id_recinto})
        .populate('juntas')
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


function create(id_zona, body) {
    var deferred = Q.defer();

    // validation  
    Recinto.findOne(
        {code: body.code},
        function (err, item) {
            if (err) deferred.reject(err);

            if (item) {
                // already exists
                deferred.reject('Code "' + body.code + '" is already taken');
            } else {
                createRecinto(body);
            }
        });


    function createRecinto(obj) {
        obj.zona = id_zona;

        Recinto.create(
            obj,
            function (err, doc) {
                if (err) {
                    deferred.reject(err);
                } else {

                    Zona.findById(id_zona, function (err, zona) {
                        zona.recintos.push(doc);
                        zona.save(function (error) {
                            if (error) deferred.reject(error);
                        });
                    });
                }

                deferred.resolve();
            });


    }

    return deferred.promise;
}

function update(id_zona, id_recinto, body) {
    var deferred = Q.defer();
    // validation
    Recinto.findOne({zona: id_zona, _id: id_recinto}, function (err, item) {
        if (err) deferred.reject(err);

        if (item.code !== body.code) {
            // code has changed so check if the new code is already taken
            Recinto.findOne(
                {code: body.code},
                function (err, item) {
                    if (err) deferred.reject(err);

                    if (item) {
                        // username already exists
                        deferred.reject('Code "' + body.code + '" is already taken')
                    } else {
                        updateRecinto(body);
                    }
                });
        } else {
            updateRecinto(body);
        }
    });

    function updateRecinto(obj) {
        Recinto.findOne({zona: id_zona, _id: id_recinto}, function (err, rec) {
            if (err) deferred.reject(err);
            rec.name = obj.name;
            rec.code = obj.code;
            rec.save(function (err) {
                if (err)deferred.reject(err);
                deferred.resolve();
            });


        });
    }

    return deferred.promise;
}

function _delete(id_recinto) {
    var deferred = Q.defer();

    Recinto.remove(
        {_id: id_recinto},
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
