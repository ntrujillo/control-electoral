(function (angular) {
    angular.module('ControlElectoralApp').controller('AuthorizationCtrl', ['$scope', 'Authorization', 'APP', '$state',
        function ($scope, Authorization, constant, $state) {

            $scope.init = function () {
                var user = ($scope.user !== null) ? $scope.user._id : null;
                Authorization.rolesByUser.query({idUsuario: user}, function (roles) {
                    $scope.roles = roles;
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            $scope.loadRol = function (rol) {
                $scope.setValueStorage(constant.CONTEXT.ROL, rol);
                $scope.rolMenu = rol;
                $scope.$emit('to_parent', $scope.rolMenu);
            };
            $scope.loadPage = function () {
                Authorization.rolStatus.get({rol: $scope.rolMenu}, function (response) {
                    if (response.status) {
                        $state.go('app.resultados.general');
                    } else {
                        $scope.notification.showErrorWithFilter(response.message, constant.COMMONS.ERROR);
                    }
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            };
        }
    ]);
}(window.angular));