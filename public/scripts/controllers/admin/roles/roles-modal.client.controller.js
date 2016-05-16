(function (angular) {
    angular.module('ControlElectoralApp').controller('RolModalCtrl', ['$scope', '$http', '$uibModalInstance', 'RolesSrv', 'rolModel', 'Notification',
        function ($scope, $http, $modalInstance, RolesSrv, rolModel, Notification) {
            var ctrl = this;

            $scope.status = [
                {code: 'V', value: 'Vigente'},
                {code: 'B', value: 'No Vigente'}
            ];

            function closeModal() {
                $modalInstance.dismiss('cancel');
            }


            function getRol(idRol) {
                RolesSrv.Api.get({_idRol: idRol}, function (rol) {
                    $scope.rol = rol;
                });
            }

            if (angular.isDefined(rolModel.idRol)) {
                getRol(rolModel.idRol);
            }

            $scope.update = function () {
                var rol = new RolesSrv.Api({});
                rol = $scope.rol;
                rol.$update({_idRol: $scope.rol._id}, function (response) {
                    Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                    onSaveFinished();
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                });
            };

            $scope.create = function () {
                var rol = new RolesSrv({
                    ro_rol: this.rol,
                    ro_description: this.descripcion,
                    ro_creator: window.user._id
                });

                rol.$save(function (response) {
                    Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 2000);
                    onSaveFinished();
                }, function (errorResponse) {
                    if (angular.isDefined(errorResponse.data.message)) {
                        Notification.showErrorWithFilter(errorResponse.data.message, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                    } else {
                        Notification.showErrorWithFilter(errorResponse.data, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                    }

                });
            };

            function onSaveFinished() {
                $modalInstance.close();
            }

            ctrl.closeModal = closeModal;
        }

    ]);

}(window.angular));