(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('CantonParroquiaResource', function ($resource) {
            return $resource('/api/canton/:id_canton/parroquia/:id', {}, {
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