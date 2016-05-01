(function (angular) {
    angular.module('ControlElectoralApp').controller('UserModalCtrl', ['$scope', '$http', '$uibModalInstance', 'Users', 'Notification',
        function ($scope, $http, $modalInstance, UserSrv, Notification) {
            var ctrl = this;
            $scope.status = [
                {code: 'V', value: 'Vigente'},
                {code: 'B', value: 'Bloqueado'}
            ];
            $scope.selectedStatus = {code: 'V', value: 'Vigente'};

            function closeModal() {
                $modalInstance.dismiss('cancel');
            }

            $scope.create = function () {
                var user = new UserSrv({
                    firstName: this.nombres,
                    lastName: this.apellidos,
                    username: this.nombreUsuario,
                    password: this.nombreUsuario,
                    email: this.email,
                    document: this.cedula,
                    status: $scope.selectedStatus.code
                });
                user.$save(function (response) {
                    Notification.success(response.message, '\u00c9xito', 1000);
                    closeModal();
                }, function (errorResponse) {
                    if (angular.isDefined(errorResponse.data.message)) {
                        Notification.showErrorWithFilter(errorResponse.data.message, 'Error');
                    } else {
                        Notification.showErrorWithFilter(errorResponse.data, 'Error');
                    }

                });
            };
            ctrl.closeModal = closeModal;
        }

    ]);

}(window.angular));