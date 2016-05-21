(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('ZonaResource', function ($resource) {
            return $resource('/api/zona/:id', {}, {
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