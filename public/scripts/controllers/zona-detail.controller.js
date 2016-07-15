(function (angular) {
    angular.module('ControlElectoralApp')
        .controller('ZonaDetailCtrl', ['$stateParams', '$uibModal', 'ZonaRecintoResource', 'ZonaResource', '$scope', 'APP',
            function ($stateParams, $modal, ServiceDetailResource, ServiceResource, $scope, constant) {
                var ctrl = this;
                ctrl.registros = [];
                ctrl.pageno = 1;
                ctrl.total_count = 0;
                ctrl.itemsPerPage = 10;

                function loadData(page) {
                    ServiceResource.get({id: $stateParams.id}, function (result) {
                        ctrl.zona = result;
                    });

                    ServiceDetailResource.query({
                        id_zona: $stateParams.id,
                        page: page,
                        per_page: ctrl.itemsPerPage,
                        q: ctrl.code,
                        sort: 'name',
                        filterName: ctrl.filterName
                    }, function (result, headers) {
                        ctrl.registros = result;
                        ctrl.total_count = headers('X-Total-Count');
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                }


                function _delete(id) {
                    ServiceDetailResource.get({id_zona: $stateParams.id, id: id}, function (result) {
                        ctrl.registro = result;
                        $('#deleteRegistroConfirmation').modal('show');
                    });
                }

                function confirmDelete(id) {
                    ServiceDetailResource.delete({id_zona: $stateParams.id, id: id},
                        function () {
                            ctrl.loadData(ctrl.pageno);
                            $('#deleteRegistroConfirmation').modal('hide');
                        });
                }

                function refresh() {
                    ctrl.loadData(ctrl.pageno);
                }

                function showModal(selectedZona) {
                    var template;
                    if (angular.isUndefined(selectedZona)) {
                        template = "views/admin/recintos/recinto-dialog.html";
                    } else {
                        template = "views/admin/recintos/recinto-dialog-edit.html";
                    }
                    var modalInstance = $modal.open({
                        templateUrl: template,
                        controller: 'RecintoDialogCtrl as ctrl',
                        size: 'md',
                        backdrop: 'static',
                        animation: true,
                        resolve: {
                            entity: function () {
                                return selectedZona;
                            },
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    {
                                        name: 'recinto-dialog',
                                        files: [
                                            'scripts/services/zona.recinto.service.js',
                                            'scripts/controllers/recinto-dialog.controller.js'
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