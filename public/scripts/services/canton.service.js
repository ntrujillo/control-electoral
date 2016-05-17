(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('CantonResource', function ($resource) {
            return $resource('/api/canton/:id', {}, {
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