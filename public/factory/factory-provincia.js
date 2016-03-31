(function (angular) {
    'use strict';

    angular.module('ControlElectoralApp').factory("FactoryProvincia", function () {
        var service = {};
        var registros = [{_id: 1, code: 201, name: 'AZUAY', id_country: 593},
            {_id: 2, code: 202, name: 'BOLIVAR', id_country: 593},
            {_id: 3, code: 203, name: 'CA?AR', id_country: 593},
            {_id: 4, code: 204, name: 'CARCHI', id_country: 593},
            {_id: 5, code: 206, name: 'CHIMBORAZO', id_country: 593},
            {_id: 6, code: 205, name: 'COTOPAXI', id_country: 593},
            {_id: 7, code: 107, name: 'EL ORO', id_country: 593},
            {_id: 8, code: 108, name: 'ESMERALDAS', id_country: 593},
            {_id: 9, code: 420, name: 'GALAPAGOS', id_country: 593},
            {_id: 10, code: 109, name: 'GUAYAS', id_country: 593},
            {_id: 11, code: 210, name: 'IMBABURA', id_country: 593},
            {_id: 12, code: 211, name: 'LOJA', id_country: 593},
            {_id: 13, code: 112, name: 'LOS RIOS', id_country: 593},
            {_id: 14, code: 113, name: 'MANABI', id_country: 593},
            {_id: 15, code: 314, name: 'MORONA SANTIAGO', id_country: 593},
            {_id: 16, code: 315, name: 'NAPO', id_country: 593},
            {_id: 17, code: 322, name: 'ORELLANA', id_country: 593},
            {_id: 18, code: 316, name: 'PASTAZA', id_country: 593},
            {_id: 19, code: 217, name: 'PICHINCHA', id_country: 593},
            {_id: 20, code: 124, name: 'SANTA ELENA', id_country: 593},
            {_id: 21, code: 223, name: 'SANTO DOMINGO DE LOS TS?CHILAS', id_country: 593},
            {_id: 22, code: 321, name: 'SUCUMBIOS', id_country: 593},
            {_id: 23, code: 218, name: 'TUNGURAHUA', id_country: 593},
            {_id: 24, code: 319, name: 'ZAMORA CHINCHIPE', id_country: 593}]


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
