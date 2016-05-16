(function (angular) {

    angular.module('ControlElectoralApp')
        .factory('ProvinciaCantonResource', function ($resource) {
            return $resource('/api/provincia/:id_provincia/canton/:id', {}, {
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