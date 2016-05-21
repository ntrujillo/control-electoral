(function (angular) {
    angular.module('ControlElectoralApp').controller('RecintoDialogCtrl',
        ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'ZonaRecintoResource', 'Notification',
            function ($scope, $stateParams, $modalInstance, entity, ServiceDetailResource, Notification) {
                $scope.initData = function (id) {
                    ServiceDetailResource.get({id_zona: $stateParams.id, id: id}, function (result) {
                        $scope.recinto = result;
                    });
                };
                var onSaveFinished = function (result) {
                    $modalInstance.close(result);
                };
                $scope.save = function () {
                    if ($scope.recinto._id != null) {
                        ServiceDetailResource.update({
                            id_zona: $stateParams.id,
                            id: $scope.recinto._id
                        }, $scope.recinto, function (response) {
                            Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                            onSaveFinished();
                        });
                    } else {
                        ServiceDetailResource.save({id_zona: $stateParams.id}, $scope.recinto, function (response) {
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