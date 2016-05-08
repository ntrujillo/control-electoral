(function (angular) {
    angular.module('ControlElectoralApp').controller('UserModalCtrl', ['$scope', '$http', '$uibModalInstance', 'Users', 'Notification', 'userModel',
        function ($scope, $http, $modalInstance, UserSrv, Notification, userModel) {
            var ctrl = this;

            $scope.status = [
                {code: 'V', value: 'Vigente'},
                {code: 'B', value: 'Bloqueado'}
            ];

            function closeModal() {
                $modalInstance.dismiss('cancel');
            }

            function getUser(idUser) {
                UserSrv.get({idUser: idUser}, function (user) {
                    $scope.usuario = user;
                }, function (errorResponse) {
                });
            }

            if (angular.isDefined(userModel.idUser)) {
                getUser(userModel.idUser);
            }

            $scope.update = function () {
                $scope.usuario.$update({idUser: $scope.usuario._id}, function (response) {
                    Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                    onSaveFinished();
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            $scope.create = function () {
                var user = new UserSrv({
                    firstName: this.nombres,
                    lastName: this.apellidos,
                    username: this.cedula,
                    password: this.cedula,
                    email: this.email,
                    document: this.cedula
                });
                //revisar el if cuando se cambie las validaciones de los campos
                //if (angular.isDefined(user)) {
                user.$save(function (response) {
                    Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 2000);
                    onSaveFinished();
                }, function (errorResponse) {
                    if (angular.isDefined(errorResponse.data.message)) {
                        Notification.showErrorWithFilter(errorResponse.data.message, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                    } else {
                        Notification.showErrorWithFilter(errorResponse.data, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                    }

                });
                /*} else {
                 Notification.showErrorWithFilter('CONTAINER.MESSAGES.MEESSAGE_INFORMATION', 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                 }*/

            };
            function onSaveFinished() {
                $modalInstance.close();
            }

            ctrl.closeModal = closeModal;
        }

    ]);

}(window.angular));