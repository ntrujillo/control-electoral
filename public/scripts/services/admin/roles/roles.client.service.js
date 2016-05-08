(function (angular) {
    angular.module('ControlElectoralApp').factory('RolesSrv', ['$resource', function ($resource) {
        return $resource('/api/rol');
    }]);

}(window.angular));