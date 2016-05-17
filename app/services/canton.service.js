var Canton = require('mongoose').model('Canton');

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

    Canton.find(criteria).count(function (error, count) {

        if (error) {
            deferred.reject(err);
        }

        response.count = count;
        //exec me permite dar mas especificaciones a find
        Canton.find(criteria)
            .select(fields)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate('cantones')
            .exec(function (error, cantones) {
                if (error) {
                    deferred.reject(err);
                }
                response.cantones = cantones;
                deferred.resolve(response);
            });

    });
    return deferred.promise;
}

function getById(id) {
    var deferred = Q.defer();
    Canton.findOne({_id: id})
        .populate('parroquias')
        .exec(function (err, canton) {
            if (err) deferred.reject(err);

            if (canton) {
                deferred.resolve(canton);
            } else {
                // canton not found
                deferred.resolve();
            }
        });

    return deferred.promise;
}


