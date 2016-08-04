(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Junta', ['$resource', function ($resource) {
        var service = {};
        service.juntaByRecinto = $resource('/api/juntas/:codeRecinto/:genero', {
            query: {
                method: "GET",
                isArray: true
            }
        });
        service.juntaByRecintoWithStatus = $resource('/api/juntasRest/:codeRecinto/:status', {
            query: {
                method: "GET",
                isArray: true
            }
        });
        service.Junta = $resource('/api/juntasRest');
        service.getJunta = $resource('/api/juntas/:id');
        service.getNumeroJuntas = $resource('/api/junta/numeroJuntas', {
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
        return service;
    }]);

}(window.angular));