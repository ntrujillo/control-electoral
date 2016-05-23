(function (angular) {
    angular.module('ControlElectoralApp')
        .controller('CantonDetailCtrl', ['$scope', '$stateParams', '$uibModal', 'CantonParroquiaResource', 'CantonResource', 'APP',
            function ($scope, $stateParams, $modal, CantonParroquiaResource, CantonResource, constant) {
                var ctrl = this;
                ctrl.registros = [];
                ctrl.pageno = 1;
                ctrl.total_count = 0;
                ctrl.itemsPerPage = 10;


                function loadData(page) {
                    CantonResource.get({id: $stateParams.id}, function (result) {
                        ctrl.canton = result;
                    });

                    CantonParroquiaResource.query({
                        id_canton: $stateParams.id,
                        page: page,
                        per_page: ctrl.itemsPerPage,
                        q: ctrl.code,
                        sort: 'name'
                    }, function (result, headers) {
                        ctrl.registros = result;
                        ctrl.total_count = headers('X-Total-Count');
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                }


                function _delete(id) {
                    CantonParroquiaResource.get({id_canton: $stateParams.id, id: id}, function (result) {
                        ctrl.registro = result;
                        $('#deleteRegistroConfirmation').modal('show');
                    });
                }

                function confirmDelete(id) {
                    CantonParroquiaResource.delete({id_canton: $stateParams.id, id: id},
                        function () {
                            ctrl.loadData(ctrl.pageno);
                            $('#deleteRegistroConfirmation').modal('hide');
                        });
                }

                function refresh() {
                    ctrl.loadData(ctrl.pageno);
                }

                function showModal(selectedCanton) {
                    var template;
                    if (angular.isUndefined(selectedCanton)) {
                        template = "views/admin/parroquias/parroquia-dialog.html";
                    } else {
                        template = "views/admin/parroquias/parroquia-dialog-edit.html";
                    }
                    var modalInstance = $modal.open({
                        templateUrl: template,
                        controller: 'ParroquiaDialogCtrl as ctrl',
                        size: 'sm',
                        backdrop: 'static',
                        animation: true,
                        resolve: {
                            entity: function () {
                                return selectedCanton;
                            },
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    {
                                        name: 'parroquia-dialog',
                                        files: [
                                            'scripts/services/canton.parroquia.service.js',
                                            'scripts/controllers/parroquia-dialog.controller.js'
                                        ]
                                    }])
                            }]
                        }
                    });

                    modalInstance.result.then(function (obj) {
                        ctrl.result = obj;
                        ctrl.refresh();
                    });
                }

                ctrl.refresh = refresh;
                ctrl.confirmDelete = confirmDelete;
                ctrl.deleteRegistro = _delete;
                ctrl.loadData = loadData;
                ctrl.showModal = showModal;
                ctrl.refresh();
            }]);
}(window.angular));