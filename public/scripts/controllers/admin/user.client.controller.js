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
            function showModal() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/admin/user-modal.html',
                    controller: 'UserModalCtrl as ctrl',
                    backdrop: 'static',
                    animation: true,
                    resolve: {
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

                modalInstance.result.then(function (obj) {
                    ctrl.result = obj;
                });
            };
            ctrl.showModal = showModal;
        }

    ]);

}(window.angular));