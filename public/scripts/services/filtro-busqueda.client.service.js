(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Filtros', ['$resource', function ($resource) {
        var service = {};
        service.Provincias = $resource('/api/provincia/:id', {query: {method: "GET", isArray: true}});
        service.Canton = $resource('/api/provincia/:id_provincia/canton', {query: {method: "GET", isArray: true}});
        service.Parroquia = $resource('/api/canton/:id_canton/parroquia', {query: {method: "GET", isArray: true}});
        service.Zona = $resource('/api/parroquia/:id_parroquia/zona', {query: {method: "GET", isArray: true}});
        service.Recinto = $resource('/api/zona/:id_zona/recinto', {query: {method: "GET", isArray: true}});
        service.Junta = $resource('/api/recinto/:id_recinto/junta', {query: {method: "GET", isArray: true}});
        return service;
    }]);

}(window.angular));