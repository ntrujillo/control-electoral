(function (angular) {
    'use strict';

    angular.module('ControlElectoralApp')
        .factory('RegistroResource', ['$resource', 'DateUtils', function ($resource, DateUtils) {
            return $resource('api/registro/:id', {}, {
                'query': {method: 'GET', isArray: true},
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'update': {method: 'PUT'}
            });
        }]);
}(window.angular));