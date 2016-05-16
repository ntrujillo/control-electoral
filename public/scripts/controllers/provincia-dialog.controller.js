(function (angular) {
    'use strict';

    angular.module('ControlElectoralApp').controller('ProvinciaDialogCtrl',
        ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'ProvinciaResource', 'Notification',
            function ($scope, $stateParams, $modalInstance, entity, ProvinciaResource, Notification) {


                $scope.initData = function (id) {
                    ProvinciaResource.get({id: id}, function (result) {
                        $scope.provincia = result;
                    });
                };

                var onSaveFinished = function (result) {
                    $modalInstance.close(result);
                };

                $scope.save = function () {
                    if ($scope.provincia._id != null) {
                        ProvinciaResource.update({id: $scope.provincia._id}, $scope.provincia, function (response) {
                            Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                            onSaveFinished();
                        });
                    } else {
                        ProvinciaResource.save($scope.provincia, function (response) {
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