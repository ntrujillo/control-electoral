(function (angular) {
    angular.module('ControlElectoralApp')
        .factory('JuntaUserResource', function ($resource) {
            return $resource('/api/juntasUser/:id_user', {}, {
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