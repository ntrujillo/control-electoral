var Parroquia = require('mongoose').model('Parroquia');
var Q = require('q');
var plus = "+";
var comma = ",";
var service = {};

service.query = query;
service.getById = getById;


module.exports = service;

function query(q, fields, sort, page, perPage) {
    var criteria = {};
    var response = {};
    var deferred = Q.defer();

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
            .populate('zonas')
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

function getById(id) {
    var deferred = Q.defer();
    Parroquia.findOne({_id: id})
        .populate('zonas')
        .exec(function (err, parroquia) {
            if (err) deferred.reject(err);

            if (Parroquia) {
                deferred.resolve(parroquia);
            } else {
                // parroquia not found
                deferred.resolve();
            }
        });

    return deferred.promise;
}


