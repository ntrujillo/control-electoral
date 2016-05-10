(function (angular) {
    angular.module('ControlElectoralApp').factory('RolesSrv', ['$resource', function ($resource) {
        var service = {};
        service = $resource('/api/rol');
        service.Api = $resource('/api/rolId/:_idRol', {_idRol: '@_id'}, {update: {method: 'PUT'}});
        service.Roles = $resource('/api/roles');
        service.RolesByUSer = $resource('/api/usuarioRol');
        return service;
    }]);

}(window.angular));