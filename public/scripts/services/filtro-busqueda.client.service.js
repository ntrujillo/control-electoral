(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Filtros', ['$resource', function ($resource) {
        var service = {};
        service.Provincias = $resource('/api/provinces', {query: {method: "GET", isArray: true}});
        service.Canton = $resource('/api/cantones/:codeProvince', {query: {method: "GET", isArray: true}});
        service.Parroquia = $resource('/api/parroquias/:codeCanton', {query: {method: "GET", isArray: true}});
        return service;
    }]);

}(window.angular));