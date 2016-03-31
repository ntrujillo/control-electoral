(function (angular) {
    'use strict';

    angular.module('ControlElectoralApp').factory("FactoryGenero", function () {
        var service = {};

        var genero = [{
            code: 'M',
            value: 'Hombres'
        }, {
            code: 'F',
            value: 'Mujeres'
        }];

        var registros = [{
            code: 1,
            name: "Hombres",
            description: "Junta Hombres"
        }, {
            code: 2,
            name: "Mujeres",
            description: "Junta Mujeres"
        }];


        service.getRegistros = function () {
            return registros;
        };

        service.getGenero = function () {
            return genero;
        };

        service.getRegistroById = function (code) {
            var tmp = undefined;
            for (var i = 0; i < registros.length; i++) {
                if (registros[i].code === code)
                    tmp = registros[i];
            }
            return tmp;
        };


        return service;
    });

}(window.angular));