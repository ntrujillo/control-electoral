(function (angular) {
    angular.module('ControlElectoralApp').controller('RegistroVotoCtrl', ['$scope', '$uibModal', 'APP', 'JuntaUserResource',
        function ($scope, $modal, constant, JuntaUserResource) {

            $scope.selectedJunta = null;
            //return users
            JuntaUserResource.get({id_user: window.user._id}, function (response) {
                var juntasByUser = angular.fromJson(response);
                $scope.juntasByUserAsignado = juntasByUser.junta;
            }, function (errorResponse) {
                $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
            });

            $scope.changeJunta = function (junta) {
                $scope.juntaInformation = junta;
                $scope.genero = $scope.juntaInformation.gender === 'F' ? 'Mujeres' : 'Hombres';
            };

        }
    ]);
}(window.angular));