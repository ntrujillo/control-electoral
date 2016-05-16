(function (angular) {
    angular.module('ControlElectoralApp')
        .controller('ProvinciaCtrl', ['ProvinciaResource', '$uibModal', '$scope', 'APP', function (ProvinciaResource, $modal, $scope, constant) {
            var ctrl = this;
            ctrl.registros = [];
            ctrl.pageno = 1;
            ctrl.total_count = 0;
            ctrl.itemsPerPage = 10;

            function loadData(page) {
                ProvinciaResource.query({
                    page: page,
                    per_page: ctrl.itemsPerPage,
                    q: ctrl.filter
                }, function (result, headers) {
                    ctrl.registros = result;
                    ctrl.total_count = headers('X-Total-Count');
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            function _delete(id) {
                ProvinciaResource.get({id: id}, function (result) {
                    ctrl.registro = result;
                    $('#deleteRegistroConfirmation').modal('show');
                });
            }

            function confirmDelete(id) {
                ProvinciaResource.delete({id: id},
                    function () {
                        ctrl.refresh();
                        $('#deleteRegistroConfirmation').modal('hide');
                    });
            }

            function refresh() {
                ctrl.loadData(ctrl.pageno);
            }

            function showModal(selectedProvincia) {
                var template;
                if (angular.isUndefined(selectedProvincia)) {
                    template = "views/admin/provincia/provincia-dialog.html";
                } else {
                    template = "views/admin/provincia/provincia-dialog-edit.html";
                }

                var modalInstance = $modal.open({
                    templateUrl: template,
                    controller: 'ProvinciaDialogCtrl as ctrl',
                    size: 'sm',
                    backdrop: 'static',
                    animation: true,
                    resolve: {
                        entity: function () {
                            return selectedProvincia;
                        },
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'provincia-dialog',
                                    files: [
                                        'scripts/services/provincia.service.js',
                                        'scripts/controllers/provincia-dialog.controller.js'
                                    ]
                                }])
                        }]
                    }
                });

                modalInstance.result.then(function (obj) {
                    ctrl.result = obj;
                    ctrl.refresh()
                });
            }

            ctrl.refresh = refresh;
            ctrl.confirmDelete = confirmDelete;
            ctrl.deleteRegistro = _delete;
            ctrl.showModal = showModal;
            ctrl.loadData = loadData;
            ctrl.refresh();


        }]);
}(window.angular));