(function (angular) {
    angular.module('ControlElectoralApp').factory('Authorization', ['$resource', function ($resource) {
        return $resource('/api/usuarioRol/:idUsuario', {query: {method: "GET", isArray: true}});
    }]);

}(window.angular));