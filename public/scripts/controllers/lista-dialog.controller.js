(function (angular) {
    angular.module('ControlElectoralApp').controller('ListaDialogCtrl',
        ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Lista', 'Notification',
            function ($scope, $stateParams, $modalInstance, entity, Lista, Notification) {
                $scope.initData = function (id) {
                    Lista.get({id_lista: id}, function (result) {
                        $scope.lista = result;
                    });
                };
                var onSaveFinished = function (result) {
                    $modalInstance.close(result);
                };
                $scope.save = function () {
                    if ($scope.lista._id != null) {
                        Lista.update({
                            id_lista: $scope.lista._id
                        }, $scope.lista, function (response) {
                            Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                            onSaveFinished();
                        });
                    } else {
                        Lista.save($scope.lista, function (response) {
                            Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 2000);
                            onSaveFinished();
                        }, function (errorResponse) {
                            if (angular.isDefined(errorResponse.data.message)) {
                                Notification.showErrorWithFilter(errorResponse.data.message, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                            } else {
                                Notification.showErrorWithFilter(errorResponse.data, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                            }
                        });
                    }
                };
                $scope.clear = function () {
                    $modalInstance.dismiss('cancel');
                };
                if (entity) {
                    $scope.initData(entity._id);
                }

            }]);
}(window.angular));