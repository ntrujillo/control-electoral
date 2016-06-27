var mongoose = require('mongoose'),
    Junta = require('mongoose').model('Junta'),
    Logger = require(__dirname + '/../../app/log/Logger'),
    Voto = mongoose.model('Voto');

var getErrorMessage = function (err) {
    if (err) {
        for (var errName in err.errors) {
            if (err.errors.hasOwnProperty(errName)) {
                return err.errors[errName].message;
            }
        }
    } else {
        return 'Unknow server error';
    }
};

exports.saveVoto = function (req, res) {
    var voto = new Voto(req.body);
    Logger.logInfo('voto junta' + req.body.JUNTA);
    voto.save(function (err) {
        if (err) {
            Logger.logError('[VotosCtrl] Error al guadar el voto', voto);
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[VotosCtrl] Se guarda el voto correctamente', voto);
            Junta.findOne({_id: req.body.JUNTA._id}, function (err, jun) {
                if (err) {
                    return res.status(400).send({message: getErrorMessage(err)});
                }
                jun.status = 'VR';
                jun.save(function (err) {
                    if (err) {
                        return res.status(400).send({message: getErrorMessage(err)});
                    }
                });
            });
            return res.status(200).json({message: 'CONTAINER.VOTO.MESSAGE_VOTO_SAVE_SERVICE'});
        }
    });
};

exports.getVoto = function (req, res) {
    Voto.findOne({"JUNTA._id": req.query.idJunta}, function (err, voto) {
        if (err) {
            Logger.logError('[VotosCtrl] Error al recuperar el voto');
            return res.status(400).send({message: getErrorMessage(err)});
        }
        return res.status(200).json(voto);
    });
};

exports.countVotBlancos = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Voto.aggregate({$unwind: "$VOT_VALIDOS"}, {
        $match: {
            "JUNTA.recinto.zona.parroquia.canton.provincia._id": codeProvince
            //"VOT_VALIDOS.LISTA": '56f20ac0bea3747445b0de4b'
        }
    }, {
        $group: {
            _id: "$JUNTA.recinto.zona.parroquia.canton.provincia._id",
            totalBlancos: {$sum: "$BLANCOS"},
            totalNulos: {$sum: "$NULOS"},
            totalVotantes: {$sum: "$TOTAL_VOTOS"},
            VOT_VALIDOS2: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
        }
    }, function (err, tot) {
        return res.status(200).send(tot);

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
                return res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosByProvince = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia.canton.provincia._id": codeProvince
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia.canton.provincia._id",
                votosTotales: {$sum: "$TOTAL_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosByCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia.canton._id": codeCanton
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia.canton._id",
                votosTotales: {$sum: "$TOTAL_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosTotales[0]);
            }
        });
};

exports.totalVotosByParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia._id": codeParroquia
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia._id",
                votosTotales: {$sum: "$TOTAL_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosTotales[0]);
            }
        });
};

exports.votosTotalesFiltro = function (req, res) {
    var filtro, match;
    var codeZona = req.query.codeZona;
    var codeRecinto = req.query.codeRecinto;
    var codeJunta = req.query.codeJunta;
    if (codeZona) {
        match = {"JUNTA.recinto.zona._id": codeZona};
        filtro = "JUNTA.recinto.zona._id";
    }
    if (codeRecinto) {
        match = {"JUNTA.recinto._id": codeRecinto};
        filtro = "JUNTA.recinto._id";
    }
    if (codeJunta) {
        match = {"JUNTA._id": codeJunta};
        filtro = "JUNTA._id";
    }
    Voto.aggregate({
            $match: match
        },
        {
            $group: {
                _id: "$" + filtro,
                votosTotales: {$sum: "$TOTAL_VOTOS"}
            }
        }, function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosTotales[0]);
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
                return res.status(200).send(totalVotBlancos[0]);
            }
        });
};

exports.votosBlancoByProvince = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia.canton.provincia._id": codeProvince
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia.canton.provincia._id",
                votosBlancos: {$sum: "$BLANCOS"}
            }
        }, function (err, VotBlancosByProvince) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(VotBlancosByProvince[0]);
            }
        });
};

exports.votosBlancoByCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia.canton._id": codeCanton
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia.canton._id",
                votosBlancos: {$sum: "$BLANCOS"}
            }
        }, function (err, VotBlancosByCanton) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(VotBlancosByCanton[0]);
            }
        });
};

exports.votosBlancoByParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia._id": codeParroquia
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia._id",
                votosBlancos: {$sum: "$BLANCOS"}
            }
        }, function (err, VotBlancosByParroquia) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(VotBlancosByParroquia[0]);
            }
        });
};

exports.votosBlancoFiltro = function (req, res) {
    var filtro, match;
    var codeZona = req.query.codeZona;
    var codeRecinto = req.query.codeRecinto;
    var codeJunta = req.query.codeJunta;
    if (codeZona) {
        match = {"JUNTA.recinto.zona._id": codeZona};
        filtro = "JUNTA.recinto.zona._id";
    }
    if (codeRecinto) {
        match = {"JUNTA.recinto._id": codeRecinto};
        filtro = "JUNTA.recinto._id";
    }
    if (codeJunta) {
        match = {"JUNTA._id": codeJunta};
        filtro = "JUNTA._id";
    }
    Voto.aggregate({
            $match: match
        },
        {
            $group: {
                _id: "$" + filtro,
                votosBlancos: {$sum: "$BLANCOS"}
            }
        }, function (err, votosBlancoFiltro) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosBlancoFiltro[0]);
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
                return res.status(200).send(votosNulos[0]);
            }
        });
};

exports.votosNulosByProvince = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia.canton.provincia._id": codeProvince
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia.canton.provincia._id",
                votosNulos: {$sum: "$NULOS"}
            }
        }, function (err, votosNulos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosNulos[0]);
            }
        });
};

exports.votosNulosByCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia.canton._id": codeCanton
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia.canton._id",
                votosNulos: {$sum: "$NULOS"}
            }
        }, function (err, votosNulos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosNulos[0]);
            }
        });
};

exports.votosNulosByParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    Voto.aggregate({
            $match: {
                "JUNTA.recinto.zona.parroquia._id": codeParroquia
            }
        },
        {
            $group: {
                _id: "$JUNTA.recinto.zona.parroquia._id",
                votosNulos: {$sum: "$NULOS"}
            }
        }, function (err, votosNulos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosNulos[0]);
            }
        });
};

exports.votosNulosFiltro = function (req, res) {
    var filtro, match;
    var codeZona = req.query.codeZona;
    var codeRecinto = req.query.codeRecinto;
    var codeJunta = req.query.codeJunta;
    if (codeZona) {
        match = {"JUNTA.recinto.zona._id": codeZona};
        filtro = "JUNTA.recinto.zona._id";
    }
    if (codeRecinto) {
        match = {"JUNTA.recinto._id": codeRecinto};
        filtro = "JUNTA.recinto._id";
    }
    if (codeJunta) {
        match = {"JUNTA._id": codeJunta};
        filtro = "JUNTA._id";
    }
    Voto.aggregate({
            $match: match
        },
        {
            $group: {
                _id: "$" + filtro,
                votosNulos: {$sum: "$NULOS"}
            }
        }, function (err, votosNulos) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                //simpre va a retornar un elemento
                return res.status(200).send(votosNulos[0]);
            }
        });
};

//votos por lista
exports.totalVotosLista = function (req, res) {
    var codeLista = req.params.codeLista;
    Voto.aggregate().unwind("$VOT_VALIDOS").match({"VOT_VALIDOS.LISTA": codeLista}).group({
        _id: null,
        totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
    }).exec(
        function (err, votosTotales) {
            if (err) {
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                Logger.logInfo('[VotosCtrl] total de votos de la lista' + codeLista + votosTotales + ' dd');
                //simpre va a retornar un elemento
                return res.status(200).json(votosTotales[0]);
            }
        });
};

exports.totalVotosListaProvincia = function (req, res) {
    var codeProvince = req.params.codeProvince;
    var codeLista = req.params.codeLista;
    Voto.aggregate().unwind("$VOT_VALIDOS").match({
        "JUNTA.recinto.zona.parroquia.canton.provincia._id": codeProvince,
        "VOT_VALIDOS.LISTA": codeLista
    }).group({
        _id: "$JUNTA.recinto.zona.parroquia.canton.provincia._id",
        totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
    }).exec(function (err, votosTotales) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            //simpre va a retornar un elemento
            return res.status(200).send(votosTotales[0]);
        }
    });
};

exports.totalVotosListaCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    var codeLista = req.params.codeLista;
    Voto.aggregate().unwind("$VOT_VALIDOS").match({
        "JUNTA.recinto.zona.parroquia.canton._id": codeCanton,
        "VOT_VALIDOS.LISTA": codeLista
    }).group({
        _id: "$JUNTA.recinto.zona.parroquia.canton._id",
        totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
    }).exec(function (err, votosTotales) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            //simpre va a retornar un elemento
            return res.status(200).send(votosTotales[0]);
        }
    });
};

exports.totalVotosListaParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    var codeLista = req.params.codeLista;
    Voto.aggregate().unwind("$VOT_VALIDOS").match({
        "JUNTA.recinto.zona.parroquia._id": codeParroquia,
        "VOT_VALIDOS.LISTA": codeLista
    }).group({
        _id: "$JUNTA.recinto.zona.parroquia._id",
        totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
    }).exec(function (err, votosTotales) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            //simpre va a retornar un elemento
            return res.status(200).send(votosTotales[0]);
        }
    });
};

exports.totalVotosListaFiltro = function (req, res) {
    var filtro, match;
    var codeZona = req.query.codeZona;
    var codeRecinto = req.query.codeRecinto;
    var codeJunta = req.query.codeJunta;
    var codeLista = req.query.codeLista;
    if (codeZona) {
        match = {"JUNTA.recinto.zona._id": codeZona, "VOT_VALIDOS.LISTA": codeLista};
        filtro = "JUNTA.recinto.zona._id";
    }
    if (codeRecinto) {
        match = {"JUNTA.recinto._id": codeRecinto, "VOT_VALIDOS.LISTA": codeLista};
        filtro = "JUNTA.recinto._id";
    }
    if (codeJunta) {
        match = {"JUNTA._id": codeJunta, "VOT_VALIDOS.LISTA": codeLista};
        filtro = "JUNTA._id";
    }
    Voto.aggregate().unwind("$VOT_VALIDOS").match(match).group({
        _id: "$" + filtro,
        totalVotos: {$sum: "$VOT_VALIDOS.NUM_VOTOS"}
    }).exec(function (err, votosTotales) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            //simpre va a retornar un elemento
            return res.status(200).send(votosTotales[0]);
        }
    });
};

exports.getVotosByFecha = function (req, res) {
    var f1 = req.params.f1;

    Voto.aggregate().match({
        FECHA_REGISTRO: {
            $lte: new Date(f1)
        }
    }).group({
        _id: {},
        totalVotos: {$sum: "$TOTAL_VOTOS"}
    }).exec(function (err, votosTotales) {
        if (err) {
            Logger.logError('[VotosCtrl] error al obtner los votos totales a la fecha', f1);
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            //simpre va a retornar un elemento
            Logger.logInfo('[VotosCtrl] Votos totales a la fecha' + f1, votosTotales);
            return res.status(200).send(votosTotales[0]);
        }
    });
};

exports.getMinMaxFechaVoto = function (req, res) {
    Logger.logInfo('[VotosCtrl] entro');
    Voto.aggregate({
        $group: {
            _id: null,
            minVotoFecha: {$min: "$FECHA_REGISTRO"},
            maxVotoFecha: {$max: "$FECHA_REGISTRO"}
        }
    }, function (err, response) {
        if (err) {
            Logger.logError('[VotosCtrl] error al obtner la fecha del primer voto');
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[VotosCtrl] Se recuper\u00f3 la fecha del primer voto', response);
            return res.status(200).json(response[0]);
        }
    });
};

//votos de cada lista con fecha
exports.votosByListaWithDate = function (req, res) {
    var codeLista = req.params.codeLista;
    var fecha = req.params.fecha;
    Voto.aggregate().unwind("$VOT_VALIDOS").match({
        "VOT_VALIDOS.LISTA": codeLista,
        "FECHA_REGISTRO": {$lte: new Date(fecha)}
    }).exec(
        function (err, votos) {
            if (err) {
                Logger.logError('[VotosCtrl] Error al obtener los votos de la lista ' + codeLista + ' a la fecha: ' + fecha + ' ' + getErrorMessage(err));
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                Logger.logInfo('[VotosCtrl] Se obtuvo los votos de la lista ' + codeLista + ' a la fecha: ' + fecha + ' ', votos);
                //simpre va a retornar un elemento
                return res.status(200).json(votos);
            }
        });
};