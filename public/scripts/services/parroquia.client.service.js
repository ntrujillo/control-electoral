(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Parroquia', ['$resource', function ($resource) {
        return $resource('/api/parroquias/:codeCanton', {query: {method: "GET", isArray: true}});
    }]);

}(window.angular));