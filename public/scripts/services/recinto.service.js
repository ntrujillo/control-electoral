(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('RecintoResource', function ($resource) {
            return $resource('/api/recinto/:id', {}, {
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