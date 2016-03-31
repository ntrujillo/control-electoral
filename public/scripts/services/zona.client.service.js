(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Zona', ['$resource', function ($resource) {
        return $resource('/api/zonas/:codeParroquia', {query: {method: "GET", isArray: true}});
    }]);

}(window.angular));