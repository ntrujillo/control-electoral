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


            /* function showModal(idUSer) {
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
             getRoles();
             });
             }*/

            // ctrl.showModal = showModal;
            ctrl.getRoles = getRoles;
        }

    ]);

}(window.angular));