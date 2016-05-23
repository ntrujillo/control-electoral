(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('Lista', function ($resource) {
            return $resource('/api/lista/:id_lista', {}, {
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