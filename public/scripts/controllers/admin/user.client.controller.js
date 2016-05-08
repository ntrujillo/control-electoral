(function (angular) {
    angular.module('ControlElectoralApp').controller('UserCtrl', ['$scope', '$http', '$uibModal', 'Users', 'User', 'APP',
        function ($scope, $http, $modal, UserSrv, User, constant) {
            var ctrl = this;
            ctrl.userCedula = null;
            ctrl.total_count = 0;
            ctrl.itemsPerPage = 10;
            ctrl.currentPage = 1;

            function getUsers() {
                UserSrv.query({page: ctrl.currentPage, numRegistros: ctrl.itemsPerPage}, function (response, headers) {
                    var usersArray = angular.fromJson(response);
                    ctrl.total_count = parseInt(headers('X-Total-Count'));
                    $scope.users = [];
                    usersArray.forEach(function (user) {
                        var u = new User(user);
                        $scope.users.push(u);
                    });
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            getUsers();

            function getUserByCedula(cedula) {
                if (cedula !== null && cedula !== "") {
                    UserSrv.Api.query({
                        cedula: cedula
                    }, function (response) {
                        var usersArray = angular.fromJson(response);
                        $scope.users = [];
                        usersArray.forEach(function (user) {
                            var u = new User(user);
                            $scope.users.push(u);
                        });
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                } else {
                    getUsers();
                }
                ctrl.userCedula = null;
            }

            function showModal(idUSer) {
                var template;
                if (angular.isDefined(idUSer)) {
                    template = 'views/admin/user-modal-edit.html';
                } else {
                    template = 'views/admin/user-modal.html';
                }
                var modalInstance = $modal.open({
                    templateUrl: template,
                    controller: 'UserModalCtrl as ctrl',
                    backdrop: 'static',
                    animation: true,
                    resolve: {
                        userModel: function () {
                            return {
                                idUser: idUSer
                            };
                        },
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                    name: 'angular-factory',
                                    files: [
                                        'scripts/controllers/admin/user-modal.client.controller.js'
                                    ]
                                }
                            );
                        }]
                    }
                });

                modalInstance.result.then(function () {
                    getUsers();
                });
            }

            ctrl.showModal = showModal;
            ctrl.getUsers = getUsers;
            ctrl.getUserByCedula = getUserByCedula;
        }

    ]);

}(window.angular));