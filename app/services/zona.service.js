var Zona = require('mongoose').model('Zona');
var Q = require('q');
var plus = "+";
var comma = ",";
var service = {};

service.query = query;
service.getById = getById;


module.exports = service;

function query(q, fields, sort, page, perPage, filterName, isFilterOr) {
    var criteria = {},
        response = {},
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
            .populate('recintos')
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

function getById(id) {
    var deferred = Q.defer();
    Zona.findOne({_id: id})
        .populate('zonas')
        .exec(function (err, zona) {
            if (err) deferred.reject(err);

            if (zona) {
                deferred.resolve(zona);
            } else {
                // user not found
                deferred.resolve();
            }
        });

    return deferred.promise;
}


