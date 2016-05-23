(function (angular) {
    angular.module('ControlElectoralApp').controller('ParroquiaDialogCtrl',
        ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'CantonParroquiaResource', 'Notification',
            function ($scope, $stateParams, $modalInstance, entity, CantonParroquiaResource, Notification) {
                $scope.initData = function (id) {
                    CantonParroquiaResource.get({id_canton: $stateParams.id, id: id}, function (result) {
                        $scope.parroquia = result;
                    });
                };
                var onSaveFinished = function (result) {
                    $modalInstance.close(result);
                };
                $scope.save = function () {
                    if ($scope.parroquia._id != null) {
                        CantonParroquiaResource.update({
                            id_canton: $stateParams.id,
                            id: $scope.parroquia._id
                        }, $scope.parroquia, function (response) {
                            Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                            onSaveFinished();
                        });
                    } else {
                        CantonParroquiaResource.save({id_canton: $stateParams.id}, $scope.parroquia, function (response) {
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