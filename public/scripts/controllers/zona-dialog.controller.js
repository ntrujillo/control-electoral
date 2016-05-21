(function (angular) {

    angular.module('ControlElectoralApp').controller('ZonaDialogCtrl',
        ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'ParroquiaZonaResource', 'Notification',
            function ($scope, $stateParams, $modalInstance, entity, ServiceDetailResource, Notification) {
                $scope.initData = function (id) {
                    ServiceDetailResource.get({id_parroquia: $stateParams.id, id: id}, function (result) {
                        $scope.zona = result;
                    });
                };
                var onSaveFinished = function (result) {
                    $scope.$emit('fimepedApp:cantonUpdate', result);
                    $modalInstance.close(result);
                };
                $scope.save = function () {
                    if ($scope.zona._id != null) {
                        ServiceDetailResource.update({
                            id_parroquia: $stateParams.id,
                            id: $scope.zona._id
                        }, $scope.zona, function (response) {
                            Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                            onSaveFinished();
                        });
                    } else {
                        ServiceDetailResource.save({id_parroquia: $stateParams.id}, $scope.zona, function (response) {
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