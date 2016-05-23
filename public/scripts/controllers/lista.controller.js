(function (angular) {
    angular.module('ControlElectoralApp')
        .controller('ListaCtrl', ['$scope', '$stateParams', '$uibModal', 'Lista', 'APP',
            function ($scope, $stateParams, $modal, Lista, constant) {
                var ctrl = this;
                ctrl.registros = [];
                ctrl.pageno = 1;
                ctrl.total_count = 0;
                ctrl.itemsPerPage = 10;


                function loadData(page) {
                    Lista.query({
                        id_lista: $stateParams.id_lista,
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
                    Lista.get({id: id}, function (result) {
                        ctrl.registro = result;
                        $('#deleteRegistroConfirmation').modal('show');
                    });
                }

                function confirmDelete(id) {
                    Lista.delete({id_canton: $stateParams.id, id: id},
                        function () {
                            ctrl.loadData(ctrl.pageno);
                            $('#deleteRegistroConfirmation').modal('hide');
                        });
                }

                function refresh() {
                    ctrl.loadData(ctrl.pageno);
                }

                function showModal(selectedLista) {
                    var template;
                    if (angular.isUndefined(selectedLista)) {
                        template = "views/admin/listas/lista-dialog.html";
                    } else {
                        template = "views/admin/listas/lista-dialog-edit.html";
                    }
                    var modalInstance = $modal.open({
                        templateUrl: template,
                        controller: 'ListaDialogCtrl as ctrl',
                        size: 'md',
                        backdrop: 'static',
                        animation: true,
                        resolve: {
                            entity: function () {
                                return selectedLista;
                            },
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    {
                                        name: 'lista-dialog',
                                        files: [
                                            'scripts/services/lista.client.service.js',
                                            'scripts/controllers/lista-dialog.controller.js'
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