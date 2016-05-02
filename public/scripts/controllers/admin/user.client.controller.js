(function (angular) {
    angular.module('ControlElectoralApp').controller('UserCtrl', ['$scope', '$http', '$uibModal', 'Users', 'User',
        function ($scope, $http, $modal, UserSrv, User) {
            var ctrl = this;

            function getUsers() {
                UserSrv.query(function (response) {
                    var usersArray = angular.fromJson(response);
                    $scope.users = [];
                    usersArray.forEach(function (user) {
                        var u = new User(user);
                        $scope.users.push(u);
                    });
                }, function (errorResponse) {
                    $scope.error = errorResponse;
                });
            }

            getUsers();
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
        }

    ]);

}(window.angular));