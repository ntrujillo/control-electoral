(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Region', ['$resource', function ($resource) {
        return $resource('/api/region', {query: {method: "GET", isArray: true}});
    }]);

}(window.angular));