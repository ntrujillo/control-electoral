var Provincia = require('mongoose').model('Provincia');

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'CONTAINER.PROVINCIA.MESSAGE_ALREADY_CODE';
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

function query(q, fields, sort, page, perPage, filterName, isFilterOr) {
    var criteria = {}, response = {}, like = '';
    deferred = Q.defer();

    if (isFilterOr) {
        if (filterName || q) {
            criteria = {$or: [{code: (q) ? q : ''}, {name: (filterName) ? {$regex: '^' + filterName} : ''}]};
        }
    } else {
        if (q) {
            criteria = {code: q};
        }
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

    console.log('filtro', criteria);
    Provincia.find(criteria).count(function (error, count) {

        if (error) {
            deferred.reject(error);
        }

        response.count = count;
        //exec me permite dar mas especificaciones a find
        Provincia.find(criteria)
            .select(fields)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .sort(sort)
            .populate('cantones')
            .exec(function (error, provincias) {
                if (error) {
                    deferred.reject(err);
                }
                response.provincias = provincias;
                deferred.resolve(response);
            });

    });
    return deferred.promise;
}

function getById(id) {
    var deferred = Q.defer();
    Provincia.findOne({_id: id})
        .populate('cantones')
        .exec(function (err, provincia) {
            if (err) deferred.reject(err);

            if (provincia) {
                deferred.resolve(provincia);
            } else {
                // user not found
                deferred.resolve();
            }
        });

    return deferred.promise;
}


function create(provinciaParam) {
    var deferred = Q.defer();
    Provincia.create(
        provinciaParam,
        function (err) {
            if (err) deferred.reject(getErrorMessage(err));

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, provinciaParam) {
    var deferred = Q.defer();
    // validation
    Provincia.findById(_id, function (err, provincia) {
        if (err) deferred.reject(err);

        if (provincia.code !== provinciaParam.code) {
            // code has changed so check if the new code is already taken
            Provincia.findOne(
                {code: provinciaParam.code},
                function (err, provincia) {
                    if (err) deferred.reject(err);

                    if (provincia) {
                        // username already exists
                        deferred.reject('Code "' + provinciaParam.code + '" is already taken')
                    } else {
                        updateProvincia(provinciaParam);
                    }
                });
        } else {
            updateProvincia(provinciaParam);
        }
    });

    function updateProvincia(provincia) {
        Provincia.findById(_id,
            function (err, prov) {
                if (err) deferred.reject(err);
                prov.name = provincia.name;
                prov.code = provincia.code;
                prov.save(function (err) {
                    if (err)deferred.reject(err);
                    deferred.resolve();
                });


            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    Provincia.remove(
        {_id: _id},
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
