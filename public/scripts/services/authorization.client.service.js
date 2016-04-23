(function (angular) {
    angular.module('ControlElectoralApp').factory('Authorization', ['$resource', function ($resource) {
        var service = {};
        service.rolesByUser = $resource('/api/usuarioRol/:idUsuario', {query: {method: "GET", isArray: true}});
        service.rolStatus = $resource('/api/rol/:rol');
        return service;
    }]);

}(window.angular));