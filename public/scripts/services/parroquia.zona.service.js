(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('ParroquiaZonaResource', function ($resource) {
            return $resource('/api/parroquia/:id_parroquia/zona/:id', {}, {
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