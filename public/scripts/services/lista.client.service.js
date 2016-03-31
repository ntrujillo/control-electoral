(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Lista', ['$resource', function ($resource) {
        return $resource('/api/lista', {query: {method: "GET", isArray: true}});
    }]);

}(window.angular));