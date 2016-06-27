var mongoose = require('mongoose'),
    Voto = mongoose.model('Voto');

var getErrorMessage = function (err) {
    if (err) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                return err.errors[errName].message;
            }
        }
    } else {
        return 'Unknow server error';
    }
};

exports.saveVoto = function (req, res) {
    var voto = new Voto(req.body);
    voto.save(function (err) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.json(voto);
        }
    });
};

function countV(array) {
    var votosBlancos = 0;
    var votoslista35 = 0;
    array.forEach(function (element) {
        votosBlancos = votosBlancos + element.BLANCOS;
        votoslista35 = votoslista35 + element.VOT_VALIDOS[0].NUM_VOTOS;
    });
    return {
        votosBlancos: votosBlancos,
        votoslista35: votoslista35
    };
}

/*/exports.countVotBlancos = function (req, res) {
 var codeProvince = req.params.codeProvince;
 Voto.find({"JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE.COD_PROVINCIA": codeProvince}, function (err, votos) {
 if (err) {
 return res.status(400).send({message: getErrorMessage(err)});
 } else {
 var votosBlancos = 0;
 var votoslista35 = 0;
 votos.forEach(function (element) {
 votosBlancos = votosBlancos + element.BLANCOS;
 votoslista35 = votoslista35 + element.VOT_VALIDOS[0].NUM_VOTOS;
 });
 var d = countV(votos);
 return res.status(200).send({
 BLANCOS: d.votosBlancos,
 LISTA35: d.votoslista35
 });
 }

 });
 };*/

/*exports.countVotBlancos = function (req, res) {
 var codeProvince = req.params.codeProvince;
 Voto.aggregate({
 $group: {
 _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE._id",
 totalBlancos: {$sum: "$BLANCOS"},
 totalNulos: {$sum: "$NULOS"},
 total35: {$sum: "$VOT_VALIDOS[0].NUM_VOTOS"}
 }
 }, function (err, tot) {
 console.log('total: ' + tot);

 var countBlancos = 0;
 var countNulos = 0;
 res.status(200).send(tot);

 });
 };
 */

exports.countVotBlancos = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Voto.aggregate({$unwind: "$VOT_VALIDOS"}, {
        $match: {
            "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE._id": codeProvince
            //"VOT_VALIDOS.LISTA": '56f20ac0bea3747445b0de4b'
        }
    }, {
        $group: {
            _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE._id",
            totalBlancos: {$sum: "$BLANCOS"},
            totalNulos: {$sum: "$NULOS"},
            totalVotantes: {$sum: "$TOTAL_VOTOS"},
            VOT_VALIDOS2: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
        }
    }, function (err, tot) {
        res.status(200).send(tot);

    });
};
//Votos total Votos
exports.votosTotales = function (req, res) {
    Voto.aggregate(
        {
            $group: {
                _id: null,
                votosTotales: {$sum: "$TOTAL_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosByProvince = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE._id": codeProvince
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE.COD_PROVINCIA",
                votosTotales: {$sum: "$TOTAL_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosByCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON._id": codeCanton
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.COD_CANTON",
                votosTotales: {$sum: "$TOTAL_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosByParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA._id": codeParroquia
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.COD_PARROQUIA",
                votosTotales: {$sum: "$TOTAL_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosTotales[0]);
            }
        });
};

//Votos Blancos

exports.votosBlancoTotal = function (req, res) {
    Voto.aggregate(
        {
            $group: {
                _id: null,
                votosBlancos: {$sum: "$BLANCOS"}
            }
        }, function (err, totalVotBlancos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(totalVotBlancos[0]);
            }
        });
};

exports.votosBlancoByProvince = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE._id": codeProvince
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE.COD_PROVINCIA",
                votosBlancos: {$sum: "$BLANCOS"}
            }
        }, function (err, VotBlancosByProvince) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(VotBlancosByProvince[0]);
            }
        });
};

exports.votosBlancoByCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON._id": codeCanton
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.COD_CANTON",
                votosBlancos: {$sum: "$BLANCOS"}
            }
        }, function (err, VotBlancosByCanton) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(VotBlancosByCanton[0]);
            }
        });
};

exports.votosBlancoByParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA._id": codeParroquia
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.COD_PARROQUIA",
                votosBlancos: {$sum: "$BLANCOS"}
            }
        }, function (err, VotBlancosByParroquia) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(VotBlancosByParroquia[0]);
            }
        });
};

//Votos Nulos

exports.votosNulosTotal = function (req, res) {
    Voto.aggregate(
        {
            $group: {
                _id: null,
                votosNulos: {$sum: "$NULOS"}
            }
        }, function (err, votosNulos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosNulos[0]);
            }
        });
};

exports.votosNulosByProvince = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE._id": codeProvince
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE.COD_PROVINCIA",
                votosNulos: {$sum: "$NULOS"}
            }
        }, function (err, votosNulos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosNulos[0]);
            }
        });
};

exports.votosNulosByCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON._id": codeCanton
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.COD_CANTON",
                votosNulos: {$sum: "$NULOS"}
            }
        }, function (err, votosNulos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosNulos[0]);
            }
        });
};

exports.votosNulosByParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    Voto.aggregate({
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA._id": codeParroquia
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.COD_PARROQUIA",
                votosNulos: {$sum: "$NULOS"}
            }
        }, function (err, votosNulos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosNulos[0]);
            }
        });
};

//votos por lista
exports.totalVotosLista = function (req, res) {
    var codeLista = req.params.codeLista;
    Voto.aggregate({$unwind: "$VOT_VALIDOS"}, {
            $match: {
                "VOT_VALIDOS.LISTA": codeLista
            }
        },
        {
            $group: {
                _id: null,
                totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosListaProvincia = function (req, res) {
    var codeProvince = req.params.codeProvince;
    var codeLista = req.params.codeLista;
    Voto.aggregate({$unwind: "$VOT_VALIDOS"}, {
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE._id": codeProvince,
                "VOT_VALIDOS.LISTA": codeLista
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.PROVINCE.COD_PROVINCIA",
                totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosListaCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    var codeLista = req.params.codeLista;
    Voto.aggregate({$unwind: "$VOT_VALIDOS"}, {
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA.CANTON._id": codeCanton,
                "VOT_VALIDOS.LISTA": codeLista
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.CANTON.COD_CANTON",
                totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosListaParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    var codeLista = req.params.codeLista;
    Voto.aggregate({$unwind: "$VOT_VALIDOS"}, {
            $match: {
                "JUNTA.RECINTO.ZONA.PARROQUIA._id": codeParroquia,
                "VOT_VALIDOS.LISTA": codeLista
            }
        },
        {
            $group: {
                _id: "$JUNTA.RECINTO.ZONA.PARROQUIA.COD_PARROQUIA",
                totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                res.status(200).send(votosTotales[0]);
            }
        });
};