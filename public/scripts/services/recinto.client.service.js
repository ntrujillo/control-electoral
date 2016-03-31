(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Recinto', ['$resource', function ($resource) {
        return $resource('/api/recinto/:codeZona/:codeParroquia', {query: {method: "GET", isArray: true}});
    }]);

}(window.angular));