var mongoose = require('mongoose'),
    Registro = mongoose.model('Registro');
//apunto al archivo Registro.js por default node agrega la extension .js
//expresiones regulares
var plus = /\+/g;
var comma = /,/g;

function queryRegistros(req, res) {
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

    Registro.find(criteria).count(function (error, count) {

        if (error) {
            res.sendStatus(500);
        }

        res.header('X-Total-Count', count);
        //exec me permite dar mas especificaciones a find
        Registro.find(criteria)
            .select(fields)
            .sort(sort)
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec(function (error, registros) {
                if (error) {
                    return res.status(500).json(error);
                }
                res.json(registros);
            });

    });

}


function search(req, res) {
    var q = req.query.q;
    Registro.find({$text: {$search: q}}, function (error, registros) {
        if (error) {
            return res.sendStatus(500);
        }
        res.json(registros);
    });
}


function getRegistro(req, res) {
    var id = req.params.id;
    console.log('Recuperando registro -> ', req.params.id);
    Registro.findById(id, function (error, Registro) {
        if (error) {
            return res.status(500).json(error);
        }

        res.json(Registro);
    });
}

function createRegistro(req, res) {
    var Reg = req.body;
    console.log('Creando registro -> ', req.body);
    Reg.createdAt = new Date().toISOString();

    Registro.create(Reg, function (error, newRegistro) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(newRegistro);
        }
    });
}

function deleteRegistro(req, res) {
    var id = req.params.id;
    Registro.remove({_id: id}, function (error, Registro) {
        if (error) {
            return res.status(500).json(error);
        }
        if (Registro.result.n === 0) {
            return res.status(404).json('Registro does not exist!');
        }
        res.sendStatus(204);
    });
}


module.exports.queryRegistros = queryRegistros;
module.exports.getRegistro = getRegistro;
module.exports.createRegistro = createRegistro;
module.exports.search = search;
module.exports.deleteRegistro = deleteRegistro;