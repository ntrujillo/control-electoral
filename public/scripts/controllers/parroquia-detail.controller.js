(function (angular) {

    angular.module('ControlElectoralApp')
        .controller('ParroquiaDetailCtrl', ['$scope', '$stateParams', '$uibModal', 'ParroquiaZonaResource', 'ParroquiaResource', 'APP',
            function ($scope, $stateParams, $modal, ServiceDetailResource, ServiceResource, constant) {
                var ctrl = this;
                ctrl.registros = [];
                ctrl.pageno = 1;
                ctrl.total_count = 0;
                ctrl.itemsPerPage = 10;

                function loadData(page) {
                    ServiceResource.get({id: $stateParams.id}, function (result) {
                        ctrl.parroquia = result;
                    });

                    ServiceDetailResource.query({
                        id_parroquia: $stateParams.id,
                        page: page,
                        per_page: ctrl.itemsPerPage,
                        q: ctrl.code
                    }, function (result, headers) {
                        ctrl.registros = result;
                        ctrl.total_count = headers('X-Total-Count');
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                }

                function _delete(id) {
                    ServiceDetailResource.get({id_parroquia: $stateParams.id, id: id}, function (result) {
                        ctrl.registro = result;
                        $('#deleteRegistroConfirmation').modal('show');
                    });
                }

                function confirmDelete(id) {
                    ServiceDetailResource.delete({id_parroquia: $stateParams.id, id: id},
                        function () {
                            ctrl.loadData(ctrl.pageno);
                            $('#deleteRegistroConfirmation').modal('hide');
                        });
                }

                function refresh() {
                    ctrl.loadData(ctrl.pageno);
                }

                function showModal(selectedParroquia) {
                    var template;
                    if (angular.isUndefined(selectedParroquia)) {
                        template = "views/admin/zonas/zona-dialog.html";
                    } else {
                        template = "views/admin/zonas/zona-dialog-edit.html";
                    }
                    var modalInstance = $modal.open({
                        templateUrl: template,
                        controller: 'ZonaDialogCtrl as ctrl',
                        size: 'sm',
                        backdrop: 'static',
                        animation: true,
                        resolve: {
                            entity: function () {
                                return selectedParroquia;
                            },
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    {
                                        name: 'zona-dialog',
                                        files: [
                                            'scripts/services/parroquia.zona.service.js',
                                            'scripts/controllers/zona-dialog.controller.js'
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