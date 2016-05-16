(function (angular) {
    angular.module('ControlElectoralApp').controller('RolCtrl', ['$scope', '$http', '$uibModal', 'RolesSrv', 'Rol', 'APP',
        function ($scope, $http, $modal, RolesSrv, Rol, constant) {
            var ctrl = this;
            ctrl.total_count = 0;
            ctrl.itemsPerPage = 10;
            ctrl.currentPage = 1;

            function getRoles() {
                RolesSrv.query({page: ctrl.currentPage, numRegistros: ctrl.itemsPerPage}, function (response, headers) {
                    var rolesArray = angular.fromJson(response);
                    ctrl.total_count = parseInt(headers('X-Total-Count'));
                    $scope.roles = [];
                    rolesArray.forEach(function (object) {
                        var rol = new Rol(object);
                        $scope.roles.push(rol);
                    });
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            getRoles();


            function showModal(idRol) {
                var template;
                if (angular.isDefined(idRol)) {
                    template = 'views/admin/roles/rol-modal-edit.html';
                } else {
                    template = 'views/admin/roles/rol-modal-create.html';
                }
                var modalInstance = $modal.open({
                    templateUrl: template,
                    controller: 'RolModalCtrl as ctrl',
                    backdrop: 'static',
                    animation: true,
                    resolve: {
                        rolModel: function () {
                            return {
                                idRol: idRol
                            };
                        },
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                    name: 'angular-factory',
                                    files: [
                                        'scripts/services/admin/roles/roles.client.service.js',
                                        'scripts/controllers/admin/roles/roles-modal.client.controller.js'
                                    ]
                                }
                            );
                        }]
                    }
                });

                modalInstance.result.then(function () {
                    getRoles();
                });
            }

            ctrl.showModal = showModal;
            ctrl.getRoles = getRoles;
        }

    ]);

}(window.angular));