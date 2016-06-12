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
        service.Junta = $resource('/api/juntasRest');
        service.getJunta = $resource('/api/juntas/:id');
        return service;
    }]);

}(window.angular));