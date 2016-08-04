(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('AuditoriaService', ['$resource', function ($resource) {
        var service = {};
        service.Save = $resource('/api/auditoria');
        return service;

    }]);

}(window.angular));