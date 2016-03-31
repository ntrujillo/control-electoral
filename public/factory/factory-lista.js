(function (angular) {
    'use strict';

    angular.module('ControlElectoralApp').factory("FactoryLista", function () {
        var service = {};
        var registros = [
            {
                code: 35,
                name: "Alianza Pais",
                votos: 0
            },
            {
                code: 12,
                name: "CREO",
                votos: 0
            }
            , {
                code: 18,
                name: "ASP",
                votos: 0
            }, {
                code: 10,
                name: "PRE",
                votos: 0
            }, {
                code: 19,
                name: "Nueva",
                votos: 0
            }, {
                code: 7,
                name: "Otro Sentido",
                votos: 0
            }, {
                code: 40,
                name: "Derecha",
                votos: 0
            }]


        service.getRegistros = function () {
            return registros;
        }

        service.getRegistroById = function (code) {
            var tmp = undefined;
            for (var i = 0; i < registros.length; i++) {
                if (registros[i].code === code)
                    tmp = registros[i];
            }
            return tmp;
        }


        return service;
    });

}(window.angular));