(function (angular) {
    angular.module('ControlElectoralApp').controller('UserModalCtrl', ['$scope', '$http', '$uibModalInstance', 'Users', 'Notification', 'userModel', 'RolesSrv',
        function ($scope, $http, $modalInstance, UserSrv, Notification, userModel, RolesSrv) {
            var ctrl = this;

            $scope.selectedRolIds = [];

            function selectElement(firstArray, secondArray) {
                var flag = false, roles = [];
                for (var i in firstArray) {
                    flag = false;
                    for (var j in secondArray) {
                        if (firstArray[i] === secondArray[j]) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        roles.push(firstArray[i]);
                    }
                }
                return roles;
            }

            function getRoles() {
                RolesSrv.Roles.query({}, function (roles) {
                    $scope.selectOptions = {
                        placeholder: "Seleccione Roles...",
                        dataTextField: "ro_description",
                        dataValueField: "_id",
                        valuePrimitive: true,
                        autoClose: false,
                        autoBind: false,
                        tagMode: "single",
                        dataSource: roles
                    };

                }, function (errorResponse) {
                });

            }

            function saveRolesByUser(roles, idUsuario) {
                roles.forEach(function (id) {
                    var rolUser = new RolesSrv.RolesByUSer({
                        ur_rol: id,
                        ur_user: idUsuario
                    });
                    rolUser.$save();
                });
            }

            function deleteRol(roles, idUsuario) {
                roles.forEach(function (id) {
                    RolesSrv.RolesByUSer.delete({idUsuario: idUsuario, idRol: id});
                });
            }

            $scope.status = [
                {code: 'V', value: 'Vigente'},
                {code: 'B', value: 'Bloqueado'}
            ];

            function closeModal() {
                $modalInstance.dismiss('cancel');
            }

            function getRolesByStatus(idUser) {
                RolesSrv.RolesByUSer.query({idUsuario: idUser}, function (roles) {
                    roles.forEach(function (element) {
                        $scope.selectedRolIds.push(element.ur_rol._id);
                    });
                    window.roles = $scope.selectedRolIds;
                });
            }

            function getUser(idUser) {
                UserSrv.get({idUser: idUser}, function (user) {
                    $scope.usuario = user;
                }, function (errorResponse) {
                });
            }

            //si tiene idUser es modo edicion de la modal
            if (angular.isDefined(userModel.idUser)) {
                getUser(userModel.idUser);
                getRolesByStatus(userModel.idUser);
            }
            getRoles();

            $scope.update = function () {
                var rolesToDelete = selectElement(window.roles, $scope.selectedRolIds);
                var rolesToAdd = selectElement($scope.selectedRolIds, window.roles);
                console.log('roles par eliminar', rolesToDelete);
                console.log('roles para anaidr', rolesToAdd);
                $scope.usuario.$update({idUser: $scope.usuario._id}, function (response) {
                    if (rolesToDelete.length > 0) {
                        deleteRol(rolesToDelete, userModel.idUser);
                    }
                    if (rolesToAdd.length > 0) {
                        saveRolesByUser(rolesToAdd, userModel.idUser);
                    }
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
                    email: this.email,
                    document: this.cedula
                });

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