(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Province', ['$resource', function ($resource) {
        return $resource('/api/provinces', {query: {method: "GET", isArray: true}});
    }]);

}(window.angular));