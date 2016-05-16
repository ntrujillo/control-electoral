(function (angular) {

    angular.module('ControlElectoralApp').controller('CantonDialogCtrl',
        ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'ProvinciaCantonResource', 'Notification',
            function ($scope, $stateParams, $modalInstance, entity, ProvinciaCantonResource, Notification) {


                $scope.initData = function (id) {
                    ProvinciaCantonResource.get({id_provincia: $stateParams.id, id: id}, function (result) {
                        $scope.canton = result;
                    });
                };

                var onSaveFinished = function (result) {
                    $modalInstance.close(result);
                };

                $scope.save = function () {
                    if ($scope.canton._id != null) {
                        ProvinciaCantonResource.update({
                            id_provincia: $stateParams.id,
                            id: $scope.canton._id
                        }, $scope.canton, function (response) {
                            Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                            onSaveFinished();
                        });
                    } else {
                        ProvinciaCantonResource.save({id_provincia: $stateParams.id}, $scope.canton, function (response) {
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