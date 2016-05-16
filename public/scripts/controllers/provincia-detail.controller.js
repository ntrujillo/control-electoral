(function (angular) {

    angular.module('ControlElectoralApp')
        .controller('ProvinciaDetailCtrl', ['$stateParams', '$scope', '$uibModal', 'ProvinciaCantonResource', 'ProvinciaResource', 'APP',
            function ($stateParams, $scope, $modal, ProvinciaCantonResource, ProvinciaResource, constant) {
                var ctrl = this;
                ctrl.registros = [];
                ctrl.pageno = 1;
                ctrl.total_count = 0;
                ctrl.itemsPerPage = 10;


                function loadData(page) {
                    ProvinciaResource.get({id: $stateParams.id}, function (result) {
                        ctrl.provincia = result;
                    });

                    ProvinciaCantonResource.query({
                        id_provincia: $stateParams.id,
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
                    ProvinciaCantonResource.get({id_provincia: $stateParams.id, id: id}, function (result) {
                        ctrl.registro = result;
                        $('#deleteRegistroConfirmation').modal('show');
                    });
                }

                function confirmDelete(id) {
                    ProvinciaCantonResource.delete({id_provincia: $stateParams.id, id: id},
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
                        template = "views/admin/cantones/canton-dialog.html";
                    } else {
                        template = "views/admin/cantones/canton-dialog-edit.html";
                    }

                    var modalInstance = $modal.open({
                        templateUrl: template,
                        controller: 'CantonDialogCtrl as ctrl',
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
                                        name: 'provincia-dialog',
                                        files: [
                                            'scripts/services/provincia.canton.service.js',
                                            'scripts/controllers/canton-dialog.controller.js'
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