(function (angular) {
    angular.module('ControlElectoralApp').factory('Users', ['$resource', function ($resource) {
        var service = {};
        service = $resource('/api/users/:idUser', {idUser: '@_id'}, {update: {method: 'PUT'}});
        return service;
    }]);

}(window.angular));