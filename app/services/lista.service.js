var Lista = require('mongoose').model('Lista');
var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'CONTAINER.LISTA.MESSAGE_ALREADY_CODE';
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

function query(id_code_lista, q, fields, sort, page, perPage) {

    var criteria = {};
    var response = {};
    var deferred = Q.defer();

    if (id_code_lista) {
        criteria.CODE_LISTA = id_code_lista;
    }

    if (q) {
        criteria = {CODE_LISTA: q};
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

    Lista.find(criteria).count(function (error, count) {

        if (error) {
            deferred.reject(err);
        }

        response.count = count;
        //exec me permite dar mas especificaciones a find
        Lista.find(criteria)
            .select(fields)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec(function (error, listas) {
                if (error) {
                    deferred.reject(err);
                }
                response.listas = listas;
                deferred.resolve(response);
            });

    });
    return deferred.promise;
}

function getById(id_lista) {
    var deferred = Q.defer();
    Lista.findOne({_id: id_lista})
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


function create(body) {
    var deferred = Q.defer();
    Lista.create(
        body,
        function (err) {
            if (err) {
                deferred.reject(getErrorMessage(err));
            } else {
                deferred.resolve();
            }
        });

    return deferred.promise;
}

function update(id_lista, body) {
    var deferred = Q.defer();
    // validation
    Lista.findOne({_id: id_lista}, function (err, parr) {
        if (err) deferred.reject(err);
        console.log('parr', parr);
        parr.NOM_VIC = body.NOM_VIC;
        parr.NOM_PRE = body.NOM_PRE;
        parr.NOM_LISTA = body.NOM_LISTA;
        parr.save(function (err) {
            if (err)deferred.reject(err);
            deferred.resolve();
        });


    });

    return deferred.promise;
}

function _delete(id_lista) {
    var deferred = Q.defer();

    Lista.remove(
        {_id: id_lista},
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}
