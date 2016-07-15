var Recinto = require('mongoose').model('Recinto');
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
            .populate('juntas')
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

function getById(id) {
    var deferred = Q.defer();
    Recinto.findOne({_id: id})
        .populate('juntas')
        .exec(function (err, junta) {
            if (err) deferred.reject(err);

            if (junta) {
                deferred.resolve(junta);
            } else {
                // user not found
                deferred.resolve();
            }
        });

    return deferred.promise;
}


