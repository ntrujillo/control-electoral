var Parroquia = require('mongoose').model('Parroquia');
var Zona = require('mongoose').model('Zona');
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

function query(id_parroquia, q, fields, sort, page, perPage) {

    var criteria = {};
    var response = {};
    var deferred = Q.defer();

    if (id_parroquia) {
        criteria.parroquia = id_parroquia;
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

    Zona.find(criteria).count(function (error, count) {

        if (error) {
            deferred.reject(err);
        }

        response.count = count;
        //exec me permite dar mas especificaciones a find
        Zona.find(criteria)
            .select(fields)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec(function (error, zonas) {
                if (error) {
                    deferred.reject(err);
                }
                response.zonas = zonas;
                deferred.resolve(response);
            });

    });
    return deferred.promise;
}

function getById(id_parroquia, id_zona) {
    var deferred = Q.defer();
    Zona.findOne({parroquia: id_parroquia, _id: id_zona})
        .populate('recintos')
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


function create(id_parroquia, body) {
    var deferred = Q.defer();

    // validation  
    Zona.findOne(
        {code: body.code},
        function (err, item) {
            if (err) deferred.reject(err);

            if (item) {
                // already exists
                deferred.reject('Code "' + body.code + '" is already taken');
            } else {
                createZona(body);
            }
        });


    function createZona(obj) {
        obj.parroquia = id_parroquia;
        Zona.create(
            obj,
            function (err, doc) {
                if (err) {
                    deferred.reject(err);
                } else {

                    Parroquia.findById(id_parroquia, function (err, parroquia) {
                        parroquia.zonas.push(doc);
                        parroquia.save(function (error) {
                            if (error) deferred.reject(error);
                        });
                    });
                }

                deferred.resolve();
            });


    }

    return deferred.promise;
}

function update(id_parroquia, id_zona, body) {
    var deferred = Q.defer();
    // validation
    Zona.findOne({parroquia: id_parroquia, _id: id_zona}, function (err, item) {
        if (err) deferred.reject(err);

        if (item.code !== body.code) {
            // code has changed so check if the new code is already taken
            Zona.findOne(
                {code: body.code},
                function (err, item) {
                    if (err) deferred.reject(err);

                    if (item) {
                        // zone code already exists
                        deferred.reject('Code "' + body.code + '" is already taken')
                    } else {
                        updateZona(body);
                    }
                });
        } else {
            updateZona(body);
        }
    });

    function updateZona(obj) {
        Zona.findOne({parroquia: id_parroquia, _id: id_zona}, function (err, parr) {
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

function _delete(id_zona) {
    var deferred = Q.defer();

    Zona.remove(
        {_id: id_zona},
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
