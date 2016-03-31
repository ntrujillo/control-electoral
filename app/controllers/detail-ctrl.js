var mongoose = require('mongoose'),
    Detail = mongoose.model('Detail');

//expresiones regulares
var plus = /\+/g;
var comma = /,/g;

function queryDetails(req, res) {
    //url?param1=1&param2=2
    //req.query  ={param1:1,param2:2}
    //en caso que no vengan parametros en el url req.query = {}
    var criteria = {}
    var q = req.query.q;
    var status = req.query.status;
    var sort = req.query.sort;
    var fields = req.query.fields;
    var page = req.query.page;
    var perPage = req.query.per_page;

    if (q) {
        criteria.$text = {$search: q}
    }

    if (status) {
        criteria.status = status;
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

    console.log('criteria: ' + criteria);

    Detail.find(criteria).count(function (error, count) {

        if (error) {
            res.sendStatus(500);
        }

        res.header('X-Total-Count', count);
        //exec me permite dar mas especificaciones a find
        Detail.find(criteria)
            .select(fields)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec(function (error, details) {
                if (error) {
                    return res.status(500).json(error);
                }
                res.json(details);
            });

    });

}


function search(req, res) {
    var q = req.query.q;
    Detail.find({$text: {$search: q}}, function (error, details) {
        if (error) {
            return res.sendStatus(500);
        }
        res.json(details);
    });
}


function getDetail(req, res) {
    var id = req.params.id;
    Detail.findById(id, function (error, detail) {
        if (error) {
            return res.status(500).json(error);
        }

        res.json(detail);
    });
}

function createDetail(req, res) {
    var Detail = req.body;
    Detail.createdAt = new Date().toISOString();
    Detail.create(Detail, function (error, newDetail) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(newDetail);
        }
    });
}


module.exports.queryDetails = queryDetails;
module.exports.getDetail = getDetail;
module.exports.createDetail = createDetail;
module.exports.search = search;