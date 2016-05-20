(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('ParroquiaResource', function ($resource) {
            return $resource('/api/parroquia/:id', {}, {
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
        });
}(window.angular));