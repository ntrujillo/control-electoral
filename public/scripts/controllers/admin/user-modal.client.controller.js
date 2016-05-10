(function (angular) {
    angular.module('ControlElectoralApp').controller('UserModalCtrl', ['$scope', '$http', '$uibModalInstance', 'Users', 'Notification', 'userModel', 'RolesSrv',
        function ($scope, $http, $modalInstance, UserSrv, Notification, userModel, RolesSrv) {
            var ctrl = this;

            $scope.selectedRolIds = [];

            function getRoles() {
                RolesSrv.Roles.query({}, function (roles) {
                    $scope.selectOptions = {
                        placeholder: "Seleccione Roles...",
                        dataTextField: "ro_description",
                        dataValueField: "_id",
                        valuePrimitive: false,
                        autoClose: false,
                        autoBind: false,
                        tagMode: "single",
                        dataSource: roles
                    };
                }, function (errorResponse) {
                });
            }

            getRoles();

            function saveRolesByUser(roles, idUsuario) {
                roles.forEach(function (element) {
                    var rolUser = new RolesSrv.RolesByUSer({
                        ur_rol: element._id,
                        ur_user: idUsuario
                    });
                    rolUser.$save();
                });
            }

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
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
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
                    saveRolesByUser($scope.selectedRolIds, response.usuario);
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