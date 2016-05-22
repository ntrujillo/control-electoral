(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('RecintoJuntaResource', function ($resource) {
            return $resource('/api/recinto/:id_recinto/junta/:id', {}, {
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