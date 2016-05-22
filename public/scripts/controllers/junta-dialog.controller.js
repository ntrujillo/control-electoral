(function (angular) {
    'use strict';

    angular.module('ControlElectoralApp').controller('JuntaDialogCtrl',
        ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'RecintoJuntaResource', 'Notification',
            function ($scope, $stateParams, $modalInstance, entity, ServiceDetailResource, Notification) {
                $scope.genero = [{
                    code: 'M',
                    value: 'Masculino'
                }, {
                    code: 'F',
                    value: 'Femenino'
                }];


                $scope.initData = function (id) {
                    ServiceDetailResource.get({id_recinto: $stateParams.id, id: id}, function (result) {
                        $scope.junta = result;
                    });
                };
                var onSaveFinished = function (result) {
                    $modalInstance.close(result);
                };
                $scope.save = function () {
                    if ($scope.junta._id != null) {
                        ServiceDetailResource.update({
                            id_recinto: $stateParams.id,
                            id: $scope.junta._id
                        }, $scope.junta, function (response) {
                            Notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 5000);
                            onSaveFinished();
                        });
                    } else {
                        ServiceDetailResource.save({id_recinto: $stateParams.id}, $scope.junta, function (response) {
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
                } else {
                    $scope.junta = {};
                    $scope.junta.gender = 'M';
                }

            }]);
}(window.angular));