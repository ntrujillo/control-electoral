(function (angular) {
    angular.module('ControlElectoralApp').controller('AuthorizationCtrl', ['$scope', 'Authorization',
        function ($scope, Authorization) {

            $scope.init = function () {
                Authorization.query({idUsuario: $scope.user._id}, function (roles) {
                    $scope.roles = roles;
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
        }
    ]);
}(window.angular));